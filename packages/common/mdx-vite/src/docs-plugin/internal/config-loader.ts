// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Config, type CosmiconfigResult, cosmiconfigSync} from "cosmiconfig"

import type {QuiDocsConfig} from "../types"

import {configSchema} from "./config-schema"
import {removeTrailingSlash} from "./utils"

interface LoadedCosmicConfig {
  config: Config
  filepath: string
  isEmpty?: boolean
}

export interface ResolvedQuiDocsConfig extends QuiDocsConfig {
  appDirectory: string
  /**
   * full path to the cosmiconfig file.
   */
  filePath: string
  pageDirectory: string
}

export interface ConfigLoaderOptions {
  /**
   * Path to the qui-docs config file. This is automatically detected if omitted.
   */
  configFile?: string
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

  private resolveConfigFromCosmiconfig(
    config: CosmiconfigResult,
  ): ResolvedQuiDocsConfig {
    const parsed = configSchema.safeParse(config!.config)
    if (!parsed.success) {
      console.dir(parsed.error.issues, {depth: 10})
      throw new Error("Failed to parse config file.")
    }
    const conf = parsed.data
    return {
      ...conf,
      appDirectory: conf.appDirectory || "app",
      filePath: config!.filepath,
      pageDirectory: conf.pageDirectory
        ? removeTrailingSlash(conf.pageDirectory)
        : "routes",
    }
  }

  loadConfig(): ResolvedQuiDocsConfig {
    const config = this.getCosmiconfig()
    return this.resolveConfigFromCosmiconfig(config)
  }
}
