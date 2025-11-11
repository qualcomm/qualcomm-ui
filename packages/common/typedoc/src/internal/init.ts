// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {confirm, intro, outro, select, text} from "@clack/prompts"
import {writeFileSync} from "node:fs"
import {resolve} from "node:path"

import type {BuildOptions} from "../types"

import {getJsConfig, getJsonConfig, getTsConfig} from "./cli-file-templates"
import {loadConfig} from "./config"

enum ConfigType {
  JSON = "JSON",
  JS = "JavaScript",
  TS = "TypeScript",
}

enum DefaultConfigFile {
  JSON = "qui-typedoc.config.json",
  JS = "qui-typedoc.config.js",
  TS = "qui-typedoc.config.ts",
}

export async function init() {
  intro("Initialize TypeDoc Configuration")

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

  const apiFile = await text({
    initialValue: ".typedoc/api.json",
    message: "TypeDoc api JSON file",
    placeholder: ".typedoc/api.json",
  })

  const outputFile = await text({
    initialValue: ".typedoc/doc-props.json",
    message:
      "Relative path to the output file for the generated type documentation",
    placeholder: ".typedoc/doc-props.json",
  })

  const tsConfig = await text({
    initialValue: "tsconfig.typedoc.json",
    message: "Path to the TypeDoc parser's tsconfig",
    placeholder: "tsconfig.typedoc.json",
  })

  const config: BuildOptions = {
    apiFile: apiFile as string,
    logMode: "info",
    outputFile: outputFile as string,
    typedocOptions: {
      entryPoints: [],
      tsconfig: tsConfig as string,
    },
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
    `Config file generated successfully (${file}). Refer to the documentation to finish the setup process: https://docs.qui.qualcomm.com/guide/typedoc#entry-points`,
  )
}
