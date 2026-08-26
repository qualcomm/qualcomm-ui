import {create, insertMultiple, search, type Orama} from "@orama/orama"
import {stat} from "node:fs/promises"
import {join} from "node:path"

import type {
  SemanticSearchHighlight,
  SemanticSearchResponse,
  SemanticSearchResult,
} from "@qualcomm-ui/mdx-common"

import {
  hasSameSemanticSearchModel,
  semanticSearchArtifactFileName,
  type SemanticSearchArtifact,
} from "./semantic-search-artifact.js"
import {
  createTransformerSemanticSearchEncoder,
  type SemanticSearchEncoder,
} from "./semantic-search-encoder.server.js"
import {readSemanticSearchArtifact} from "./semantic-search-storage.server.js"

const queryEmbeddingPrefix =
  "Represent this sentence for searching relevant passages: "
const maxExcerptLength = 240

const semanticSearchSchema = {
  code: "string",
  embedding: "vector[384]",
  heading: "string",
  href: "string",
  id: "string",
  prose: "string",
  terms: "string",
  title: "string",
  typeDocNames: "string",
  typeDocProps: "string",
} as const

type SemanticSearchDatabase = Orama<typeof semanticSearchSchema>

interface SemanticSearchDocument {
  code: string
  embedding: number[]
  heading: string
  href: string
  id: string
  prose: string
  terms: string
  title: string
  typeDocNames: string
  typeDocProps: string
}

interface SemanticSearchIndex {
  database: SemanticSearchDatabase
}

export interface SemanticSearchServiceOptions {
  /** Directory containing artifact.json and the pinned model cache. */
  artifactDirectory: string

  createEncoder?: (
    modelCacheDirectory: string,
  ) => Promise<SemanticSearchEncoder>
}

export interface SemanticSearchService {
  search(query: string, limit: number): Promise<SemanticSearchResponse>
}

export function createSemanticSearchService(
  options: SemanticSearchServiceOptions,
): SemanticSearchService {
  return new ServerSemanticSearchService({
    artifactDirectory: options.artifactDirectory,
    createEncoder:
      options.createEncoder ??
      ((modelCacheDirectory) =>
        createTransformerSemanticSearchEncoder({
          cacheDirectory: modelCacheDirectory,
          localFilesOnly: true,
        })),
  })
}

/**
 * Creates a lazy, per-process resolver for a site's semantic search service.
 *
 * The model and artifact are not loaded until the first request. Each docs
 * site supplies its own artifact directory, allowing multiple sites to reuse
 * the server implementation without sharing indexes.
 */
export function createSemanticSearchServiceResolver(
  options: SemanticSearchServiceOptions,
): () => Promise<SemanticSearchService> {
  let service: Promise<SemanticSearchService> | undefined

  return () => {
    if (!service) {
      service = Promise.resolve(createSemanticSearchService(options))
    }

    return service.catch((error) => {
      service = undefined
      throw error
    })
  }
}

class ServerSemanticSearchService implements SemanticSearchService {
  private artifact: SemanticSearchArtifact | null = null
  private artifactSignature: string | null = null
  private encoder: SemanticSearchEncoder | null = null
  private encoderPromise: Promise<SemanticSearchEncoder> | null = null
  private index: SemanticSearchIndex | null = null
  private initializationPromise: Promise<void> | null = null

  constructor(
    private readonly options: Required<SemanticSearchServiceOptions>,
  ) {}

  async search(query: string, limit: number): Promise<SemanticSearchResponse> {
    await this.initialize()
    await this.reloadArtifactIfChanged()

    const encoder = await this.getEncoder()
    const [vector] = await encoder.embed([`${queryEmbeddingPrefix}${query}`])
    if (!vector) {
      throw new Error("Semantic search encoder returned no query vector.")
    }

    const index = this.index
    if (!index) {
      throw new Error("Semantic search index is not initialized.")
    }

    const result = await search(index.database, {
      boost: {
        code: 2,
        heading: 5,
        prose: 1,
        terms: 8,
        title: 4,
        typeDocNames: 8,
        typeDocProps: 8,
      },
      hybridWeights: {text: 0.2, vector: 0.8},
      limit,
      mode: "hybrid",
      properties: [
        "title",
        "heading",
        "prose",
        "terms",
        "typeDocNames",
        "typeDocProps",
        "code",
      ],
      similarity: 0.25,
      term: query,
      vector: {
        property: "embedding",
        value: vector,
      },
    })

    return {
      results: result.hits.map(({document}) => toSearchResult(document, query)),
    }
  }

  private async initialize(): Promise<void> {
    if (!this.initializationPromise) {
      this.initializationPromise = this.loadInitialState().catch((error) => {
        this.initializationPromise = null
        throw error
      })
    }

    await this.initializationPromise
  }

  private async loadInitialState(): Promise<void> {
    await this.reloadArtifact(true)
    await this.getEncoder()
  }

  private async getEncoder(): Promise<SemanticSearchEncoder> {
    if (this.encoder) {
      return this.encoder
    }

    if (!this.encoderPromise) {
      this.encoderPromise = this.options
        .createEncoder(join(this.options.artifactDirectory, "model-cache"))
        .then((encoder) => {
          const model = this.artifact?.model
          if (!model || !hasSameSemanticSearchModel(encoder.model, model)) {
            throw new Error(
              "Semantic search model does not match the artifact.",
            )
          }

          this.encoder = encoder
          return encoder
        })
        .catch((error) => {
          this.encoderPromise = null
          throw error
        })
    }

    return this.encoderPromise
  }

  private async reloadArtifactIfChanged(): Promise<void> {
    const artifactPath = join(
      this.options.artifactDirectory,
      semanticSearchArtifactFileName,
    )
    const artifactStat = await stat(artifactPath)
    const signature = `${artifactStat.mtimeMs}:${artifactStat.size}`

    if (signature !== this.artifactSignature) {
      await this.reloadArtifact(false, signature)
    }
  }

  private async reloadArtifact(
    force: boolean,
    signature?: string,
  ): Promise<void> {
    const artifactPath = join(
      this.options.artifactDirectory,
      semanticSearchArtifactFileName,
    )
    const artifactStat = await stat(artifactPath)
    const nextSignature =
      signature ?? `${artifactStat.mtimeMs}:${artifactStat.size}`

    if (!force && this.artifactSignature === nextSignature) {
      return
    }

    const artifact = await readSemanticSearchArtifact(artifactPath)
    const shouldReloadEncoder =
      this.artifact !== null &&
      !hasSameSemanticSearchModel(this.artifact.model, artifact.model)

    this.artifact = artifact
    this.artifactSignature = nextSignature
    this.index = await createSemanticSearchIndex(artifact)

    if (shouldReloadEncoder) {
      this.encoder = null
      this.encoderPromise = null
    }
  }
}

export async function createSemanticSearchIndex(
  artifact: SemanticSearchArtifact,
): Promise<SemanticSearchIndex> {
  if (artifact.model.dimensions !== 384) {
    throw new Error("Semantic search artifact has an unsupported vector size.")
  }

  const database = create({schema: semanticSearchSchema})
  const documents = artifact.sections.map(toSemanticSearchDocument)
  await insertMultiple(database, documents)

  return {database}
}

function toSemanticSearchDocument(
  section: SemanticSearchArtifact["sections"][number],
): SemanticSearchDocument {
  return {
    code: section.keywords.code,
    embedding: section.vector,
    heading: section.keywords.heading,
    href: section.display.href,
    id: section.sectionId,
    prose: section.keywords.prose,
    terms: section.keywords.terms,
    title: section.keywords.title,
    typeDocNames: section.keywords.typeDocNames,
    typeDocProps: section.keywords.typeDocProps,
  }
}

function toSearchResult(
  document: SemanticSearchDocument,
  query: string,
): SemanticSearchResult {
  const excerpt = createExcerpt(document.prose || document.heading, query)

  return {
    ...(excerpt.highlights.length ? {highlights: excerpt.highlights} : {}),
    excerpt: excerpt.text,
    heading: document.heading,
    href: document.href,
    sectionId: document.id,
    title: document.title,
  }
}

function createExcerpt(
  source: string,
  query: string,
): {highlights: SemanticSearchHighlight[]; text: string} {
  const terms = getQueryTerms(query)
  const sourceLowercase = source.toLocaleLowerCase()
  const firstMatch = terms.reduce<number | null>((match, term) => {
    const index = sourceLowercase.indexOf(term)

    if (index === -1 || (match !== null && index >= match)) {
      return match
    }

    return index
  }, null)
  const start = Math.max(0, (firstMatch ?? 0) - 80)
  const end = Math.min(source.length, start + maxExcerptLength)
  const prefix = start > 0 ? "…" : ""
  const suffix = end < source.length ? "…" : ""
  const text = `${prefix}${source.slice(start, end)}${suffix}`
  const highlights = getHighlights(text, terms)

  return {highlights, text}
}

function getHighlights(
  excerpt: string,
  terms: string[],
): SemanticSearchHighlight[] {
  const lowercaseExcerpt = excerpt.toLocaleLowerCase()
  const highlights: SemanticSearchHighlight[] = []

  for (const term of terms) {
    let start = 0
    while (start < lowercaseExcerpt.length) {
      const matchStart = lowercaseExcerpt.indexOf(term, start)
      if (matchStart === -1) {
        break
      }

      const matchEnd = matchStart + term.length
      if (
        !highlights.some(
          (highlight) =>
            matchStart < highlight.end && matchEnd > highlight.start,
        )
      ) {
        highlights.push({end: matchEnd, start: matchStart})
      }
      start = matchEnd
    }
  }

  return highlights.sort((left, right) => left.start - right.start)
}

function getQueryTerms(query: string): string[] {
  return [
    ...new Set(
      query
        .toLocaleLowerCase()
        .match(/[\p{L}\p{N}_-]+/gu)
        ?.filter(Boolean),
    ),
  ]
}
