import {mkdtemp, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {join} from "node:path"

import type {KnowledgeSections, SectionEntry} from "@qualcomm-ui/mdx-common"
import {afterEach, describe, expect, test, vi} from "vitest"

import {
  createSemanticSearchArtifactSection,
  semanticSearchModel,
} from "./semantic-search-artifact.js"
import {buildSemanticSearchArtifact} from "./semantic-search-builder.server.js"
import type {SemanticSearchEncoder} from "./semantic-search-encoder.server.js"

let temporaryDirectory: string | undefined

afterEach(async () => {
  if (temporaryDirectory) {
    await rm(temporaryDirectory, {force: true, recursive: true})
    temporaryDirectory = undefined
  }
})

describe("buildSemanticSearchArtifact", () => {
  test("embeds only navigable sections and reuses unchanged vectors", async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), "qui-semantic-search-"))
    const sectionsPath = join(temporaryDirectory, "sections.json")
    const outputDirectory = join(temporaryDirectory, "artifact")
    const searchable = createSection()
    await writeSections(sectionsPath, [
      searchable,
      createSection({
        pageFrontmatter: {hideFromSearch: true},
        sectionId: "hidden-section",
      }),
      createSection({pathname: undefined, sectionId: "knowledge-only-section"}),
    ])

    const firstEncoder = createFakeEncoder()
    const first = await buildSemanticSearchArtifact({
      encoder: firstEncoder.encoder,
      outputDirectory,
      sectionsPath,
    })
    const secondEncoder = createFakeEncoder()
    const second = await buildSemanticSearchArtifact({
      encoder: secondEncoder.encoder,
      outputDirectory,
      sectionsPath,
    })

    expect(first.embeddedSectionCount).toBe(1)
    expect(first.reusedSectionCount).toBe(0)
    expect(firstEncoder.embed).toHaveBeenCalledWith([
      "Test Page\nRouting\nConfigure nested routing.",
    ])
    expect(first.artifact.sections).toHaveLength(1)
    expect(first.artifact.sections[0]).toMatchObject({
      display: {href: "/test-page#routing"},
      sectionId: "test-page-routing",
    })

    expect(second.embeddedSectionCount).toBe(0)
    expect(second.reusedSectionCount).toBe(1)
    expect(secondEncoder.embed).not.toHaveBeenCalled()
  })

  test("re-embeds a section when its source hash changes", async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), "qui-semantic-search-"))
    const sectionsPath = join(temporaryDirectory, "sections.json")
    const outputDirectory = join(temporaryDirectory, "artifact")
    await writeSections(sectionsPath, [createSection()])

    await buildSemanticSearchArtifact({
      encoder: createFakeEncoder().encoder,
      outputDirectory,
      sectionsPath,
    })

    await writeSections(sectionsPath, [createSection({hash: "changed-hash"})])
    const encoder = createFakeEncoder()
    const result = await buildSemanticSearchArtifact({
      encoder: encoder.encoder,
      outputDirectory,
      sectionsPath,
    })

    expect(result.embeddedSectionCount).toBe(1)
    expect(result.reusedSectionCount).toBe(0)
    expect(encoder.embed).toHaveBeenCalledOnce()
  })
})

describe("createSemanticSearchArtifactSection", () => {
  test("keeps code out of embeddings while retaining it for keyword search", () => {
    const section = createSemanticSearchArtifactSection(
      createSection({
        codeExamples: [{code: "const routingOnly = true", language: "ts"}],
      }),
    )

    expect(section).toMatchObject({
      display: {href: "/test-page#routing"},
      keywords: {code: "const routingOnly = true"},
    })
    expect(section?.embeddingText).not.toContain("routingOnly")
  })
})

function createFakeEncoder(): {
  embed: ReturnType<typeof vi.fn>
  encoder: SemanticSearchEncoder
} {
  const embed = vi.fn(async (texts: string[]) =>
    texts.map((_text, index) => createVector(index + 1)),
  )

  return {
    embed,
    encoder: {embed, model: semanticSearchModel},
  }
}

function createSection(overrides: Partial<SectionEntry> = {}): SectionEntry {
  return {
    content: "Configure nested routing.",
    hash: "source-hash",
    headerPath: ["Test Page", "Routing"],
    headingLevel: 2,
    pageId: "test-page",
    pathname: "/test-page",
    rawContent: "Configure nested routing.",
    searchText: "Configure nested routing.",
    sectionId: "test-page-routing",
    sectionUrlHash: "#routing",
    ...overrides,
  }
}

async function writeSections(
  sectionsPath: string,
  sections: SectionEntry[],
): Promise<void> {
  const value: KnowledgeSections = {
    generatedAt: "2026-01-01T00:00:00.000Z",
    hash: "knowledge-hash",
    sections,
    totalSections: sections.length,
    version: 1,
  }
  await writeFile(sectionsPath, JSON.stringify(value), "utf8")
}

function createVector(value: number): number[] {
  return Array.from({length: semanticSearchModel.dimensions}, (_, index) =>
    index === 0 ? value : 0,
  )
}
