import {mkdtemp, rm, writeFile} from "node:fs/promises"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {afterEach, describe, expect, test, vi} from "vitest"

import type {KnowledgeSections, SectionEntry} from "@qualcomm-ui/mdx-common"

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
