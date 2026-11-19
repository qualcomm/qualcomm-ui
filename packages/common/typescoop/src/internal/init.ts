// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {confirm, intro, outro, select, text} from "@clack/prompts"
import {writeFileSync} from "node:fs"
import {resolve} from "node:path"

import type {BuildOptions} from "../types.js"

import {getJsConfig, getJsonConfig, getTsConfig} from "./cli-file-templates.js"
import {loadConfig} from "./config.js"

enum ConfigType {
  JSON = "JSON",
  JS = "JavaScript",
  TS = "TypeScript",
}

enum DefaultConfigFile {
  JSON = "typescoop.config.json",
  JS = "typescoop.config.js",
  TS = "typescoop.config.ts",
}

export async function init(): Promise<void> {
  intro("Initialize Typescoop Configuration")

  const currentConfig = await loadConfig()

  if (currentConfig?.config) {
    const shouldContinue = await confirm({
      message: `Existing config file detected (${currentConfig?.filepath}). If you proceed, the old config will be overwritten. Continue?`,
    })

    if (!shouldContinue) {
      outro("Configuration generation cancelled.")
      return
    }
  }

  const configType = await select({
    message: "Config file type",
    options: [
      {label: "TypeScript", value: ConfigType.TS},
      {label: "JavaScript", value: ConfigType.JS},
      {label: "JSON", value: ConfigType.JSON},
    ],
  })

  const outputFile = await text({
    initialValue: ".typescoop/type-data.json",
    message:
      "Relative path to the output file for the generated type documentation",
    placeholder: ".typescoop/type-data.json",
  })

  const tsConfig = await text({
    initialValue: "tsconfig.typescoop.json",
    message: "Path to the tsconfig of the documented files",
    placeholder: "tsconfig.typescoop.json",
  })

  const config: BuildOptions = {
    logMode: "info",
    outputFile: outputFile as string,
    tsconfig: tsConfig as string,
  }

  let file: string = ""

  switch (configType) {
    case ConfigType.JSON:
      file = DefaultConfigFile.JSON
      writeFileSync(resolve(`./${file}`), getJsonConfig(config))
      break
    case ConfigType.JS:
      file = DefaultConfigFile.JS
      writeFileSync(resolve(`./${file}`), getJsConfig(config))
      break
    case ConfigType.TS:
      file = DefaultConfigFile.TS
      writeFileSync(resolve(`./${file}`), getTsConfig(config))
      break
  }

  outro(
    `Config file generated successfully (${file}). Refer to the documentation to finish the setup process: https://docs.qui.qualcomm.com/typescoop#entry-points`,
  )
}
