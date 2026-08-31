// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TocHeading} from "@qualcomm-ui/mdx-common"
import type {QuiPropTypes} from "@qualcomm-ui/typedoc-common"

import type {NavConfig} from "../nav-builder/types.js"

export type RoutingStrategy =
  | "react-router-directory-groups"
  | "vite-generouted"
  | ((filePath: string) => string[])

export interface KnowledgeFrontmatterConfig {
  /**
   * Glob patterns for frontmatter fields to exclude (applied after include).
   */
  exclude?: string[]
  /**
   * Glob patterns for frontmatter fields to include in output.
   * Use ["*"] to include all fields.
   */
  include?: string[]
}

/**
 * Controls how page timestamp metadata is populated from git history.
 * - "off": No timestamp data is added
 * - "timestamp": Only `updatedOn` is populated
 * - "user-and-timestamp": Both `updatedOn` and `updatedBy` are populated
 */
export type PageTimestampMetadataMode =
  | "off"
  | "timestamp"
  | "user-and-timestamp"

export interface QuiDocsTypeDocOptions {
  /**
   * Whether to include each page's TypeDocProps property documentation in the
   * search index. If this is true, the property documentation for each occurrence
   * of `<TypeDocProps />` will be built into the search index.
   */
  includeInSearchIndex?: boolean | undefined
}

/**
 * OpenWebUI integration configuration.
 */
export interface OpenWebUiIntegration {
  /**
   * Path to env file containing `OPEN_WEB_UI_*` variables. Defaults to
   * `.env.{id}` by convention.
   */
  envFile?: string

  /**
   * Unique identifier for this integration.
   */
  id: string
}

/**
 * Extra content to include in knowledge output. Assumed to be Markdown.
 */
export interface KnowledgeExtraFile {
  /**
   * The Markdown content for this file.
   */
  contents: string

  /**
   * Unique identifier for this file, used for the output filename.
   */
  id: string

  /**
   * Whether to process this file as MDX content, replacing relative URLs, and
   * applying other transformations as if the file were authored as mdx
   * documentation.
   */
  processAsMdx?: boolean

  /**
   * Display title for this content.
   */
  title?: string
}

/**
 * Knowledge generation configuration for LLM integrations.
 * Presence of this config enables knowledge generation.
 */
export interface KnowledgeConfig {
  /**
   * Base URL for documentation links in the generated output.
   */
  baseUrl?: string

  /**
   * Glob patterns to exclude, relative to the resolved page directory. Supports
   * full glob syntax via minimatch.
   *
   * @example
   * ```ts
   * exclude: ['**\/internal/**', 'guide/drafts/*', '*.draft.mdx']
   * ```
   */
  exclude?: string[]

  /**
   * Extra files to include in knowledge output beyond the generated page content.
   *
   * @inheritDoc
   */
  extraFiles?: KnowledgeExtraFile[]

  /**
   * Configuration for which frontmatter fields to include in the generated
   * Markdown output. Uses glob patterns for flexible field selection.
   *
   * @inheritDoc
   */
  frontmatter?: KnowledgeFrontmatterConfig

  /**
   * Platform-specific integration configurations for uploading generated
   * knowledge to external services.
   */
  integrations?: {
    /**
     * @inheritDoc
     */
    openWebUi?: OpenWebUiIntegration[]
  }

  /**
   * Output directory for generated knowledge files, relative to the public dir.
   *
   * @default 'exports'
   */
  outputPath?: string

  /**
   * Prefix to use for page IDs. Used to generate unique page IDs for knowledgebases
   * that span multiple QUI Docs sites with potentially overlapping routes.
   *
   * @example `table-`
   */
  pageIdPrefix?: string

  /**
   * Configuration for whole-page JSON exports.
   *
   * @inheritDoc
   */
  pages?: PagesExportConfig

  /**
   * Configuration for header-scoped section exports.
   *
   * @inheritDoc
   */
  sections?: SectionExportConfig
}

export interface SearchIndexerOptions {
  /**
   * Disable the file cache. This cache stores the result of parsed MDX files based
   * on each file's md5 checksum. On subsequent edits, values are retrieved from the
   * cache and parsing is avoided for files that have not changed.
   */
  disableCache?: boolean

  /**
   * Whether to disable the legacy built-in search indexer. This has been replaced
   * with a new semantic search engine.
   */
  disableLegacySearchIndex?: boolean

  /**
   * ToC headings.
   *
   * @default ['h2','h3','h4']
   */
  headings?: TocHeading[]

  /**
   * Optional property for defining nav item hierarchy and page metadata.
   *
   * @inheritDoc
   */
  navConfig?: NavConfig[]

  /**
   * Name of the directory where the MDX pages are located. NOT the full path to the
   * directory.
   */
  pageDirectory: string

  /**
   * Controls how page timestamp metadata is populated from git history.
   *
   * @default "off"
   */
  pageTimestampMetadata?: PageTimestampMetadataMode

  /**
   * Strategy to use for building each route's path segments.  Omit this property if
   * you are using the default {@link https://github.com/kiliman/remix-flat-routes
   * remix-flat-routes} configuration.
   */
  routingStrategy?: RoutingStrategy

  /**
   * Resolved path to the React Router app directory.
   */
  srcDir: string

  /**
   * Whether to throw an error if any issues occur during MDX processing.
   *
   * @default false
   */
  throwOnError?: boolean

  /**
   * Resolved QUI TypeDoc props.
   */
  typeDocProps?: Record<string, QuiPropTypes>

  /**
   * Options for TypeDoc property documentation.
   */
  typeDocPropsOptions?: QuiDocsTypeDocOptions

  /**
   * Validate internal links in MDX pages after the page map and table of contents
   * have been assembled. Reports broken page links and fragment references to the
   * build console.
   *
   * @default true
   */
  validatePageLinks?: boolean
}

export interface QuiDocsConfig extends Omit<
  SearchIndexerOptions,
  "srcDir" | "pageDirectory" | "typeDocProps"
> {
  /**
   * Root app directory. NOT the full path to the directory.
   *
   * @default 'app'
   */
  appDirectory?: string

  /**
   * Matched files will not trigger a rebuild on hot update.
   */
  hotUpdateIgnore?: RegExp

  /**
   * Knowledge generation configuration for LLM integrations.
   *
   * @inheritDoc
   */
  knowledge?: KnowledgeConfig

  /**
   * Name of the directory where the MDX pages are located. NOT the full path to the
   * directory. This is relative to the {@link appDirectory}.
   *
   * @default 'routes'
   */
  pageDirectory?: string

  /**
   * Relative path to the typeDocProps json file. If the `<TypeDocProps />`
   * component is used in an mdx page, the data for its referenced entity will be
   * made available for property documentation rendering.
   *
   * Refer to the {@link https://docs.qui.qualcomm.com/guide/typedoc QUI typedoc guide} to learn more.
   */
  typeDocProps?: string

  /**
   * Options for TypeDoc property documentation.
   */
  typeDocPropsOptions?: QuiDocsTypeDocOptions
}

export interface ResolvedQuiDocsConfig extends QuiDocsConfig {
  appDirectory: string
  /**
   * full path to the cosmiconfig file.
   */
  filePath: string
  pageDirectory: string
}

/**
 * Configuration for whole-page exports.
 */
export interface PagesExportConfig {
  /**
   * Output path for pages.json, relative to the knowledge output directory.
   * @default 'pages.json'
   */
  outputPath?: string
}

/**
 * Configuration for header-scoped section exports.
 */
export interface SectionExportConfig {
  /**
   * Header depths that define section boundaries.
   * @default [1, 2, 3]
   */
  depths?: number[]

  /**
   * Minimum content length to create a section entry.
   * @default 0
   */
  minContentLength?: number

  /**
   * Output path for sections.json, relative to the knowledge output directory.
   * @default 'sections.json'
   */
  outputPath?: string
}

export interface QuiDocsPluginOptions {
  /**
   * Path to the qui-docs config file. This is automatically detected if omitted.
   */
  configFile?: string

  /**
   * The current working directory.
   *
   * @default process.cwd()
   */
  cwd?: string
}
