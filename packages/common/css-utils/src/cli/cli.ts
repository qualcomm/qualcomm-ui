// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"

import {CssBuilder} from "../build-css"
import {watchCss} from "../watch-css"

import {resolveConfig} from "./config"

const Commands = {
  BUILD: "build",
  WATCH: "watch",
} as const

const configSummary =
  "relative path to the qui-typedoc config file. See https://docs.qui.qualcomm.com/typedoc#config"

program
  .command(Commands.BUILD)
  .summary("Build and parse types")
  .option("--config <config>", configSummary)
  .action(async (options) => {
    const currentConfig = await resolveConfig(options.config)
    await new CssBuilder(currentConfig).build()
  })

program
  .command(Commands.WATCH)
  .summary("Watch for changes and rebuild")
  .option("--config <config>", configSummary)
  .action(async (options) => {
    const currentConfig = await resolveConfig(options.config)
    await watchCss(currentConfig)
  })

program.parse(process.argv)
