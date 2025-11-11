// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface WebUiKnowledgeConfig {
  baseUrl?: string
  /**
   * Clean the output path before generating.
   */
  clean?: boolean
  /**
   * Optional description for the project.
   */
  description?: string
  docPropsPath?: string
  /**
   * Paths to exclude, relative to the resolved page directory
   * (`${appDirectory}/${pageDirectory}`)
   */
  exclude?: string[]
  /**
   * Include relative imports for demo files.
   */
  includeImports?: boolean
  /**
   * Include a section about the QUI Tailwind Plugin variables in the generated
   * LLMs.txt
   */
  knowledgeId: string
  metadata?: string[] | undefined
  /**
   * Optional name header for the project.
   */
  name?: string
  outputMode: "per-page" | "aggregated"
  outputPath: string
  /**
   * Prefix to prepend to each page title.
   */
  pageTitlePrefix?: string
  /**
   * Resolved route dir from
   */
  routeDir: string
  verbose?: boolean
}

export interface CliConfig
  extends Omit<
    WebUiKnowledgeConfig,
    | "docPropsPath"
    | "knowledgeId"
    | "outputPath"
    | "routeDir"
    | "webUiKey"
    | "webUiUrl"
  > {
  /**
   * Path to the environment file for this request. Variables like the knowledge
   * id, auth keys, and OWUI endpoint are defined here.
   */
  envFilePath?: string
  outputPath?: string
}

export interface GlobalCliOpts {
  env?: string
}
