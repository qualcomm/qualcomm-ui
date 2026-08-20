import {readFile} from "node:fs/promises"
import {join} from "node:path"

import type {KnowledgeSections} from "@qualcomm-ui/mdx-common"

import {
  createSemanticSearchArtifact,
  createSemanticSearchArtifactSection,
  hasSameSemanticSearchModel,
  semanticSearchArtifactFileName,
  semanticSearchModel,
  type SemanticSearchArtifact,
  type SemanticSearchArtifactSection,
  type SemanticSearchArtifactSectionInput,
  type SemanticSearchModelMetadata,
} from "./semantic-search-artifact.js"
import {
  createTransformerSemanticSearchEncoder,
  type SemanticSearchEncoder,
} from "./semantic-search-encoder.server.js"
import {
  readSemanticSearchArtifact,
  writeSemanticSearchArtifactAtomically,
} from "./semantic-search-storage.server.js"

const embeddingBatchSize = 32

export interface BuildSemanticSearchArtifactOptions {
  encoder?: SemanticSearchEncoder
  outputDirectory: string
  sectionsPath: string
}

export interface BuildSemanticSearchArtifactResult {
  artifact: SemanticSearchArtifact
  embeddedSectionCount: number
  reusedSectionCount: number
}

export async function buildSemanticSearchArtifact({
  encoder: providedEncoder,
  outputDirectory,
  sectionsPath,
}: BuildSemanticSearchArtifactOptions): Promise<BuildSemanticSearchArtifactResult> {
  const sections = await readKnowledgeSections(sectionsPath)
  const artifactPath = join(outputDirectory, semanticSearchArtifactFileName)
  const model = providedEncoder?.model ?? semanticSearchModel
  const previousArtifact = await tryReadSemanticSearchArtifact(artifactPath)
  const reusableVectors = getReusableVectors(previousArtifact, model)
  const inputs = sections.sections
    .map(createSemanticSearchArtifactSection)
    .filter(
      (section): section is SemanticSearchArtifactSectionInput => section !== null,
    )
  const sectionsToEmbed = inputs.filter(
    (section) => !reusableVectors.has(getReuseKey(section)),
  )

  let encoder = providedEncoder
  if (sectionsToEmbed.length > 0 && !encoder) {
    encoder = await createTransformerSemanticSearchEncoder({
      cacheDirectory: join(outputDirectory, "model-cache"),
      localFilesOnly: false,
    })
  }

  const embeddedVectors = await embedSections(sectionsToEmbed, encoder, model)
  const artifactSections = inputs.map((section) => {
    const vector =
      reusableVectors.get(getReuseKey(section)) ??
      embeddedVectors.get(getReuseKey(section))

    if (!vector) {
      throw new Error(
        `Missing semantic search vector for section: ${section.sectionId}`,
      )
    }

    return toArtifactSection(section, vector)
  })
  const artifact = createSemanticSearchArtifact(sections, artifactSections, model)

  await writeSemanticSearchArtifactAtomically(artifactPath, artifact)

  return {
    artifact,
    embeddedSectionCount: sectionsToEmbed.length,
    reusedSectionCount: inputs.length - sectionsToEmbed.length,
  }
}

async function embedSections(
  sections: SemanticSearchArtifactSectionInput[],
  encoder: SemanticSearchEncoder | undefined,
  model: SemanticSearchModelMetadata,
): Promise<Map<string, number[]>> {
  if (sections.length === 0) {
    return new Map()
  }

  if (!encoder) {
    throw new Error("Semantic search encoder is required to embed sections.")
  }

  if (!hasSameSemanticSearchModel(encoder.model, model)) {
    throw new Error("Semantic search encoder does not match the artifact model.")
  }

  const vectors = new Map<string, number[]>()
  for (let offset = 0; offset < sections.length; offset += embeddingBatchSize) {
    const batch = sections.slice(offset, offset + embeddingBatchSize)
    const batchVectors = await encoder.embed(
      batch.map((section) => section.embeddingText),
    )

    if (batchVectors.length !== batch.length) {
      throw new Error("Semantic search encoder returned an incomplete batch.")
    }

    for (let index = 0; index < batch.length; index++) {
      const vector = batchVectors[index]
      if (
        vector.length !== model.dimensions ||
        vector.some((value) => !Number.isFinite(value))
      ) {
        throw new Error("Semantic search encoder returned an invalid vector.")
      }
      vectors.set(getReuseKey(batch[index]), vector)
    }
  }

  return vectors
}

async function readKnowledgeSections(
  sectionsPath: string,
): Promise<KnowledgeSections> {
  const value: unknown = JSON.parse(await readFile(sectionsPath, "utf8"))

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Knowledge sections export must be an object.")
  }

  const sections = value as Partial<KnowledgeSections>
  if (typeof sections.hash !== "string" || !Array.isArray(sections.sections)) {
    throw new Error("Knowledge sections export is malformed.")
  }

  return sections as KnowledgeSections
}

async function tryReadSemanticSearchArtifact(
  artifactPath: string,
): Promise<SemanticSearchArtifact | null> {
  try {
    return await readSemanticSearchArtifact(artifactPath)
  } catch {
    return null
  }
}

function getReusableVectors(
  artifact: SemanticSearchArtifact | null,
  model: SemanticSearchModelMetadata,
): Map<string, number[]> {
  if (!artifact || !hasSameSemanticSearchModel(artifact.model, model)) {
    return new Map()
  }

  return new Map(
    artifact.sections.map((section) => [
      `${section.sectionId}:${section.sourceHash}`,
      section.vector,
    ]),
  )
}

function getReuseKey(section: {
  sectionId: string
  sourceHash: string
}): string {
  return `${section.sectionId}:${section.sourceHash}`
}

function toArtifactSection(
  section: SemanticSearchArtifactSectionInput,
  vector: number[],
): SemanticSearchArtifactSection {
  const {embeddingText: _embeddingText, ...artifactSection} = section
  return {...artifactSection, vector}
}
