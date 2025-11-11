// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {existsSync} from "node:fs"
import {join, resolve} from "node:path"

import {ConfigLoader} from "../docs-plugin/internal"

import type {CliConfig, WebUiKnowledgeConfig} from "./types"

export function loadKnowledgeConfigFromEnv(
  options: CliConfig,
): WebUiKnowledgeConfig {
  const knowledgeId = process.env.KNOWLEDGE_ID
  const exclude =
    options.exclude || (process.env.FILE_EXCLUDE_PATTERN ?? "").split(",")
  const outputPath = options.outputPath || process.env.KNOWLEDGE_OUTPUT_PATH
  const prefix = process.env.PAGE_TITLE_PREFIX

  if (!knowledgeId) {
    throw new Error("Missing required KNOWLEDGE_ID environment variable")
  }

  if (!outputPath) {
    throw new Error("Missing required outputPath")
  }

  const configLoader = new ConfigLoader({})
  const resolvedConfig = configLoader.loadConfig()

  const routeDir = join(
    resolvedConfig.appDirectory,
    resolvedConfig.pageDirectory,
  )

  if (!existsSync(resolve(routeDir))) {
    throw new Error(`Route directory ${routeDir} does not exist`)
  }

  return {
    ...options,
    baseUrl: options.baseUrl || process.env.DOCS_SITE_BASE_URL,
    docPropsPath: resolvedConfig.typeDocProps,
    exclude,
    knowledgeId,
    outputPath,
    pageTitlePrefix: prefix,
    routeDir,
  }
}
