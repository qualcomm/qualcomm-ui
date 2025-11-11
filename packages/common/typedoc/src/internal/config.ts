// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {cosmiconfig, type CosmiconfigResult, cosmiconfigSync} from "cosmiconfig"
import {dirname} from "node:path"
import ts, {type ParsedCommandLine} from "typescript"

export async function loadConfig(configPath?: string) {
  const explorer = cosmiconfig("qui-typedoc")

  const result: CosmiconfigResult | null = configPath
    ? await explorer.load(configPath)
    : await explorer.search()

  return result
}

export function loadConfigSync(configPath?: string) {
  const explorer = cosmiconfigSync("qui-typedoc")

  const result: CosmiconfigResult | null = configPath
    ? explorer.load(configPath)
    : explorer.search()

  return result
}

// TODO: validate config format with zod
export async function resolveConfig(configPath?: string) {
  const config = await loadConfig(configPath)
  if (!config?.config) {
    throw new Error(
      "Config file not found. Please consult the docs at https://docs.qui.qualcomm.com/guide/typedoc#initialize-the-config",
    )
  }
  return config.config
}

export function resolveConfigSync(configPath?: string) {
  const config = loadConfigSync(configPath)
  if (!config?.config) {
    throw new Error(
      "Config file not found. Please consult the docs at https://docs.qui.qualcomm.com/guide/typedoc#initialize-the-config",
    )
  }
  return config.config
}

export function resolveTsconfig(
  tsconfigPath: string | undefined,
): ParsedCommandLine | null {
  if (!tsconfigPath) {
    return null
  }
  try {
    const configFile = ts.readConfigFile(tsconfigPath, (path) =>
      ts.sys.readFile(path),
    )
    return ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      dirname(tsconfigPath),
    )
  } catch (e) {
    console.log("Failed to read tsconfig")
    return null
  }
}
