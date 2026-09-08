// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {KnowledgeSections, SectionEntry} from "@qualcomm-ui/mdx-common"

export const semanticSearchArtifactFileName = "artifact.json"
export const semanticSearchArtifactVersion = 1

export const semanticSearchModel = {
  dimensions: 384,
  dtype: "int8",
  // MIT-licensed
  id: "Xenova/bge-small-en-v1.5",
  normalized: true,
  pooling: "mean",
  revision: "ea104dacec62c0de699686887e3f920caeb4f3e3",
} as const

export interface SemanticSearchModelMetadata {
  dimensions: number
  dtype: string
  id: string
  normalized: boolean
  pooling: string
  revision: string
}

export interface SemanticSearchDisplayText {
  excerpt: string
  heading: string
  href: string
  title: string
}

export interface SemanticSearchKeywordFields {
  code: string
  heading: string
  prose: string
  terms: string
  title: string
  typeDocNames: string
  typeDocProps: string
}

export interface SemanticSearchArtifactSection {
  display: SemanticSearchDisplayText
  keywords: SemanticSearchKeywordFields
  sectionId: string
  sourceHash: string
  vector: number[]
}

export interface SemanticSearchArtifact {
  generatedAt: string
  model: SemanticSearchModelMetadata
  sections: SemanticSearchArtifactSection[]
  sourceHash: string
  version: number
}

export interface SemanticSearchArtifactSectionInput extends Omit<
  SemanticSearchArtifactSection,
  "vector"
> {
  embeddingText: string
}

/**
 * Turns a navigable knowledge section into the data needed by the server index.
 * Code remains keyword-only so it cannot affect document embeddings.
 */
export function createSemanticSearchArtifactSection(
  section: SectionEntry,
): SemanticSearchArtifactSectionInput | null {
  if (!section.pathname || section.excludeFromSearch === true) {
    return null
  }

  const title = getPageTitle(section)
  const heading = section.headerPath.at(-1) || title
  const prose = section.searchText.trim()
  const terms = section.terms?.join(" ") ?? ""
  const {typeDocNames, typeDocProps} = getTypeDocKeywordFields(section)
  const code = section.codeExamples?.map(({code}) => code).join("\n") ?? ""

  return {
    display: {
      excerpt: prose || heading,
      heading,
      href: `${section.pathname}${section.sectionUrlHash ?? ""}`,
      title,
    },
    embeddingText: [title, heading, prose, terms, typeDocNames, typeDocProps]
      .filter(Boolean)
      .join("\n"),
    keywords: {
      code,
      heading,
      prose,
      terms,
      title,
      typeDocNames,
      typeDocProps,
    },
    sectionId: section.sectionId,
    sourceHash: section.hash,
  }
}

export function createSemanticSearchArtifact(
  sections: KnowledgeSections,
  artifactSections: SemanticSearchArtifactSection[],
  model: SemanticSearchModelMetadata,
): SemanticSearchArtifact {
  return {
    generatedAt: new Date().toISOString(),
    model,
    sections: artifactSections,
    sourceHash: sections.hash,
    version: semanticSearchArtifactVersion,
  }
}

export function hasSameSemanticSearchModel(
  left: SemanticSearchModelMetadata,
  right: SemanticSearchModelMetadata,
): boolean {
  return (
    left.dimensions === right.dimensions &&
    left.dtype === right.dtype &&
    left.id === right.id &&
    left.normalized === right.normalized &&
    left.pooling === right.pooling &&
    left.revision === right.revision
  )
}

export function parseSemanticSearchArtifact(
  value: unknown,
): SemanticSearchArtifact {
  const artifact = asRecord(value, "artifact")
  const model = parseModelMetadata(artifact.model)
  const sections = asArray(artifact.sections, "artifact.sections").map(
    (section, index) => parseSection(section, model.dimensions, index),
  )
  const sectionIds = new Set<string>()

  for (const section of sections) {
    if (sectionIds.has(section.sectionId)) {
      throw new Error(
        `Semantic search artifact contains duplicate section ID: ${section.sectionId}`,
      )
    }
    sectionIds.add(section.sectionId)
  }

  const version = asNumber(artifact.version, "artifact.version")
  if (version !== semanticSearchArtifactVersion) {
    throw new Error("Semantic search artifact has an unsupported version.")
  }

  return {
    generatedAt: asString(artifact.generatedAt, "artifact.generatedAt"),
    model,
    sections,
    sourceHash: asString(artifact.sourceHash, "artifact.sourceHash"),
    version,
  }
}

function getPageTitle(section: SectionEntry): string {
  const frontmatterTitle = section.pageFrontmatter?.title

  if (typeof frontmatterTitle === "string" && frontmatterTitle.trim()) {
    return frontmatterTitle.trim()
  }

  return section.headerPath[0] || section.pageId
}

function getTypeDocKeywordFields(section: SectionEntry): {
  typeDocNames: string
  typeDocProps: string
} {
  const typeDocNames: string[] = []
  const typeDocProps: string[] = []

  for (const type of section.types ?? []) {
    typeDocNames.push(type.type)

    for (const prop of type.props) {
      typeDocProps.push(
        [type.type, prop.name, prop.description, prop.type]
          .filter(Boolean)
          .join(" "),
      )
    }
  }

  return {
    typeDocNames: typeDocNames.join(" "),
    typeDocProps: typeDocProps.join(" "),
  }
}

function parseModelMetadata(value: unknown): SemanticSearchModelMetadata {
  const model = asRecord(value, "artifact.model")
  const dimensions = asNumber(model.dimensions, "artifact.model.dimensions")

  if (!Number.isInteger(dimensions) || dimensions <= 0) {
    throw new Error("artifact.model.dimensions must be a positive integer.")
  }

  return {
    dimensions,
    dtype: asString(model.dtype, "artifact.model.dtype"),
    id: asString(model.id, "artifact.model.id"),
    normalized: asBoolean(model.normalized, "artifact.model.normalized"),
    pooling: asString(model.pooling, "artifact.model.pooling"),
    revision: asString(model.revision, "artifact.model.revision"),
  }
}

function parseSection(
  value: unknown,
  dimensions: number,
  index: number,
): SemanticSearchArtifactSection {
  const section = asRecord(value, `artifact.sections[${index}]`)
  const display = asRecord(
    section.display,
    `artifact.sections[${index}].display`,
  )
  const keywords = asRecord(
    section.keywords,
    `artifact.sections[${index}].keywords`,
  )
  const vector = asArray(section.vector, `artifact.sections[${index}].vector`)

  if (
    vector.length !== dimensions ||
    vector.some((value) => !isFiniteNumber(value))
  ) {
    throw new Error(
      `artifact.sections[${index}].vector must contain ${dimensions} finite numbers.`,
    )
  }

  const href = asString(
    display.href,
    `artifact.sections[${index}].display.href`,
  )
  if (!href.startsWith("/")) {
    throw new Error(
      `artifact.sections[${index}].display.href must be a local path.`,
    )
  }

  return {
    display: {
      excerpt: asString(
        display.excerpt,
        `artifact.sections[${index}].display.excerpt`,
      ),
      heading: asString(
        display.heading,
        `artifact.sections[${index}].display.heading`,
      ),
      href,
      title: asString(
        display.title,
        `artifact.sections[${index}].display.title`,
      ),
    },
    keywords: {
      code: asString(
        keywords.code,
        `artifact.sections[${index}].keywords.code`,
      ),
      heading: asString(
        keywords.heading,
        `artifact.sections[${index}].keywords.heading`,
      ),
      prose: asString(
        keywords.prose,
        `artifact.sections[${index}].keywords.prose`,
      ),
      terms: asString(
        keywords.terms,
        `artifact.sections[${index}].keywords.terms`,
      ),
      title: asString(
        keywords.title,
        `artifact.sections[${index}].keywords.title`,
      ),
      typeDocNames: asString(
        keywords.typeDocNames,
        `artifact.sections[${index}].keywords.typeDocNames`,
      ),
      typeDocProps: asString(
        keywords.typeDocProps,
        `artifact.sections[${index}].keywords.typeDocProps`,
      ),
    },
    sectionId: asString(
      section.sectionId,
      `artifact.sections[${index}].sectionId`,
    ),
    sourceHash: asString(
      section.sourceHash,
      `artifact.sections[${index}].sourceHash`,
    ),
    vector: vector as number[],
  }
}

function asArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`${path} must be an array.`)
  }
  return value
}

function asBoolean(value: unknown, path: string): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`${path} must be a boolean.`)
  }
  return value
}

function asNumber(value: unknown, path: string): number {
  if (!isFiniteNumber(value)) {
    throw new Error(`${path} must be a finite number.`)
  }
  return value
}

function asRecord(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${path} must be an object.`)
  }
  return value as Record<string, unknown>
}

function asString(value: unknown, path: string): string {
  if (typeof value !== "string") {
    throw new Error(`${path} must be a string.`)
  }
  return value
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}
