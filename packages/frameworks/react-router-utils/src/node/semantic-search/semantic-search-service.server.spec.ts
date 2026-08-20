import {mkdtemp, rm} from "node:fs/promises"
import {tmpdir} from "node:os"
import {join} from "node:path"

import {afterEach, describe, expect, test, vi} from "vitest"

import {
  createSemanticSearchArtifact,
  semanticSearchArtifactFileName,
  semanticSearchModel,
  type SemanticSearchArtifactSection,
} from "./semantic-search-artifact.js"
import type {SemanticSearchEncoder} from "./semantic-search-encoder.server.js"
import {createSemanticSearchService} from "./semantic-search-service.server.js"
import {writeSemanticSearchArtifactAtomically} from "./semantic-search-storage.server.js"

let temporaryDirectory: string | undefined

afterEach(async () => {
  if (temporaryDirectory) {
    await rm(temporaryDirectory, {force: true, recursive: true})
    temporaryDirectory = undefined
  }
})

describe("createSemanticSearchService", () => {
  test("uses boosted keyword fields and prefixes query embeddings", async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), "qui-semantic-search-"))
    await writeArtifact([
      createArtifactSection({
        keywords: {
          ...emptyKeywords(),
          prose: "routing guidance",
        },
        sectionId: "prose-match",
      }),
      createArtifactSection({
        keywords: {
          ...emptyKeywords(),
          terms: "routing",
        },
        sectionId: "term-match",
      }),
    ])
    const encoder = createFakeEncoder()
    const service = createSemanticSearchService({
      artifactDirectory: temporaryDirectory,
      createEncoder: async () => encoder.encoder,
    })

    const response = await service.search("routing", 10)

    expect(encoder.embed).toHaveBeenCalledWith([
      "Represent this sentence for searching relevant passages: routing",
    ])
    expect(response.results.map((result) => result.sectionId)).toEqual([
      "term-match",
      "prose-match",
    ])
  })

  test("rejects a malformed artifact before querying the encoder", async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), "qui-semantic-search-"))
    await writeSemanticSearchArtifactAtomically(
      join(temporaryDirectory, semanticSearchArtifactFileName),
      {} as never,
    )
    const encoder = createFakeEncoder()
    const service = createSemanticSearchService({
      artifactDirectory: temporaryDirectory,
      createEncoder: async () => encoder.encoder,
    })

    await expect(service.search("routing", 10)).rejects.toThrow(
      "artifact.model must be an object.",
    )
    expect(encoder.embed).not.toHaveBeenCalled()
  })
})

function createFakeEncoder(): {
  embed: ReturnType<typeof vi.fn>
  encoder: SemanticSearchEncoder
} {
  const embed = vi.fn(async (_texts: string[]) => [createVector()])

  return {
    embed,
    encoder: {embed, model: semanticSearchModel},
  }
}

async function writeArtifact(
  sections: SemanticSearchArtifactSection[],
): Promise<void> {
  if (!temporaryDirectory) {
    throw new Error("Test artifact directory was not created.")
  }

  await writeSemanticSearchArtifactAtomically(
    join(temporaryDirectory, semanticSearchArtifactFileName),
    createSemanticSearchArtifact(
      {
        generatedAt: "2026-01-01T00:00:00.000Z",
        hash: "knowledge-hash",
        sections: [],
        totalSections: 0,
        version: 1,
      },
      sections,
      semanticSearchModel,
    ),
  )
}

function createArtifactSection(
  overrides: Partial<SemanticSearchArtifactSection> = {},
): SemanticSearchArtifactSection {
  return {
    display: {
      excerpt: "Search excerpt",
      heading: "Search heading",
      href: "/search-page#heading",
      title: "Search page",
    },
    keywords: emptyKeywords(),
    sectionId: "search-section",
    sourceHash: "source-hash",
    vector: createVector(),
    ...overrides,
  }
}

function emptyKeywords(): SemanticSearchArtifactSection["keywords"] {
  return {
    code: "",
    heading: "",
    prose: "",
    terms: "",
    title: "",
    typeDocNames: "",
    typeDocProps: "",
  }
}

function createVector(): number[] {
  return Array.from({length: semanticSearchModel.dimensions}, (_, index) =>
    index === 0 ? 1 : 0,
  )
}
