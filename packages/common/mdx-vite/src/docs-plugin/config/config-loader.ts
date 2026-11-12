// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Config, type CosmiconfigResult, cosmiconfigSync} from "cosmiconfig"

import {removeTrailingSlash} from "../path-utils.js"

import {findUnrecognizedKeys, parseSchema} from "./config-schema.js"
import {resolveLintOptions} from "./lint.js"
import type {QuiDocsConfig, ResolvedQuiDocsConfig} from "./types.js"
import {formatSchemaIssue} from "./zod.js"

interface LoadedCosmicConfig {
  config: Config
  filepath: string
  isEmpty?: boolean
}

export interface ConfigLoaderOptions {
  /**
   * Path to the qui-docs config file. This is automatically detected if omitted.
   */
  configFile?: string
}

export interface ConfigLintResult {
  /**
   * The resolved config, or `undefined` if the config has invalid values.
   */
  config: ResolvedQuiDocsConfig | undefined
  filePath: string
  /**
   * Invalid values. Unrecognized properties are in the resolved config's
   * `unrecognizedConfigKeys`.
   */
  messages: string[]
}

export class ConfigLoader {
  private readonly options: ConfigLoaderOptions

  constructor(options: ConfigLoaderOptions) {
    this.options = options
    return this
  }

  private getCosmiconfig(): LoadedCosmicConfig {
    const explorer = cosmiconfigSync("qui-docs")

    const result: CosmiconfigResult | null = this.options.configFile
      ? explorer.load(this.options.configFile)
      : explorer.search()

    if (!result) {
      throw new Error(
        "Config file not found. Please consult the docs at https://docs.qui.qualcomm.com/guide/page-setup#config",
      )
    }

    return result
  }

  private resolveConfig(
    input: unknown,
    conf: QuiDocsConfig,
    filePath: string,
  ): ResolvedQuiDocsConfig {
    return {
      ...conf,
      appDirectory: conf.appDirectory || "app",
      configuredLint: conf.lint ?? {},
      filePath,
      lint: resolveLintOptions(conf),
      pageDirectory: conf.pageDirectory
        ? removeTrailingSlash(conf.pageDirectory)
        : "routes",
      unrecognizedConfigKeys: {
        filePath,
        messages: findUnrecognizedKeys(input, conf).map(formatSchemaIssue),
      },
    }
  }

  loadConfig(): ResolvedQuiDocsConfig {
    const {config, filepath} = this.getCosmiconfig()
    const parsed = parseSchema(config)
    if (!parsed.success) {
      const issues = parsed.error.issues.map(
        (issue) => `  ${formatSchemaIssue(issue)}`,
      )
      throw new Error(
        ["Failed to parse config file.", filepath, ...issues].join("\n"),
      )
    }
    return this.resolveConfig(config, parsed.data, filepath)
  }

  /**
   * Loads the config like {@link loadConfig}, but returns invalid values instead
   * of throwing.
   */
  lintConfig(): ConfigLintResult {
    const {config, filepath} = this.getCosmiconfig()
    const parsed = parseSchema(config)
    if (!parsed.success) {
      return {
        config: undefined,
        filePath: filepath,
        messages: parsed.error.issues.map(formatSchemaIssue),
      }
    }
    return {
      config: this.resolveConfig(config, parsed.data, filepath),
      filePath: filepath,
      messages: [],
    }
  }
}
