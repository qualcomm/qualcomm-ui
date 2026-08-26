import {resolve} from "node:path"

import type {KnowledgeConfig} from "@qualcomm-ui/mdx-vite"

export interface SemanticSearchPaths {
  sectionsPath: string
}

export interface ResolveSemanticSearchPathsOptions {
  /**
   * Directory Vite uses for public assets.
   *
   * @default "public"
   */
  publicDirectory?: string
}

export interface ResolveSemanticSearchArtifactDirectoryOptions {
  /**
   * Node environment used to select the development or production location.
   *
   * @default process.env.NODE_ENV
   */
  environment?: string
}

/**
 * Resolves the knowledge section export from the site's configured output paths.
 */
export function resolveSemanticSearchPaths(
  knowledge: KnowledgeConfig | undefined,
  {publicDirectory = "public"}: ResolveSemanticSearchPathsOptions = {},
): SemanticSearchPaths {
  if (!knowledge) {
    throw new Error("Semantic search requires a knowledge sections export.")
  }

  const outputDirectory = resolve(
    publicDirectory,
    knowledge.outputPath ?? "exports",
  )

  return {
    sectionsPath: resolve(
      outputDirectory,
      knowledge.sections?.outputPath ?? "sections.json",
    ),
  }
}

/**
 * Resolves the standard server-only semantic-search artifact directory for a
 * docs-site project root.
 */
export function resolveSemanticSearchArtifactDirectory(
  projectRoot: string,
  {
    environment = process.env.NODE_ENV,
  }: ResolveSemanticSearchArtifactDirectoryOptions = {},
): string {
  return resolve(
    projectRoot,
    environment === "production"
      ? "build/server/semantic-search"
      : "generated/semantic-search",
  )
}
