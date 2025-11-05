// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {cosmiconfig, type CosmiconfigResult} from "cosmiconfig"

export async function loadConfig(configPath?: string) {
  const explorer = cosmiconfig("qui-css-utils")

  const result: CosmiconfigResult | null = configPath
    ? await explorer.load(configPath)
    : await explorer.search()

  return result
}

// TODO: validate
export async function resolveConfig(configPath?: string) {
  const config = await loadConfig(configPath)
  if (!config?.config) {
    throw new Error(
      "Config file not found. Please consult the docs at https://docs.qui.qualcomm.com/guide/typedoc#initialize-the-config",
    )
  }
  return config.config
}
