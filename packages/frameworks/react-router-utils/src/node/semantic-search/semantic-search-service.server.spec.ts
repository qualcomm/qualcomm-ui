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
  test("prioritizes semantic intent for natural-language questions", async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), "qui-semantic-search-"))
    const inlineNotificationVector = createVector(0.7)
    await writeArtifact([
      createArtifactSection({
        display: {
          excerpt: "Inline notification API reference.",
          heading: "<InlineNotification.Root>",
          href: "/components/inline-notification#inline-notification-root",
          title: "Inline Notification",
        },
        keywords: {
          ...emptyKeywords(),
          heading: "<InlineNotification.Root>",
          prose:
            "The InlineNotification component supports every property from InlineNotification.Root.",
          title: "Inline Notification",
          typeDocNames: "InlineNotificationRootProps",
          typeDocProps:
            "InlineNotificationRootProps icon ReactNode InlineNotificationRootProps id string",
        },
        sectionId: "inline-notification-root",
        vector: inlineNotificationVector,
      }),
      createArtifactSection({
        display: {
          excerpt: "Guidelines for testing UI components.",
          heading: "UI Testing",
          href: "/ai-tools/plugins/ui-testing",
          title: "UI Testing",
        },
        keywords: {
          ...emptyKeywords(),
          heading: "UI Testing",
          prose:
            "Write React component tests around public behavior and visible outcomes.",
          title: "UI Testing",
        },
        sectionId: "ui-testing",
        vector: createVector(),
      }),
    ])
    const encoder = createFakeEncoder(([text]) =>
      text?.endsWith("InlineNotification.Root")
        ? inlineNotificationVector
        : createVector(),
    )
    const service = createSemanticSearchService({
      artifactDirectory: temporaryDirectory,
      createEncoder: () => Promise.resolve(encoder.encoder),
    })

    const response = await service.search("how do I test UI components?", 10)

    expect(response.results[0]?.sectionId).toBe("ui-testing")

    const exactResponse = await service.search("InlineNotification.Root", 10)

    expect(exactResponse.results[0]?.sectionId).toBe("inline-notification-root")
  })

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

function createFakeEncoder(
  selectVector: (texts: string[]) => number[] = () => createVector(),
): {
  embed: ReturnType<typeof vi.fn>
  encoder: SemanticSearchEncoder
} {
  const embed = vi.fn((texts: string[]) =>
    Promise.resolve([selectVector(texts)]),
  )

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

function createVector(similarity = 1): number[] {
  return Array.from({length: semanticSearchModel.dimensions}, (_, index) => {
    if (index === 0) {
      return similarity
    }
    if (index === 1) {
      return Math.sqrt(1 - similarity ** 2)
    }
    return 0
  })
}
