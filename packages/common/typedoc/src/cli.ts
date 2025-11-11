// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"

import {build, init, watch} from "./internal"

const Commands = {
  BUILD: "build",
  INIT: "init",
  WATCH: "watch",
} as const

const configSummary =
  "relative path to the qui-typedoc config file. See https://docs.qui.qualcomm.com/typedoc#config"

program
  .command(Commands.INIT)
  .summary("Initialize the config file")
  .action(async () => {
    return init().catch(() => process.exit(0))
  })

program
  .command(Commands.BUILD)
  .summary("Build and parse types")
  .option("--config <config>", configSummary)
  .action(async (options) => {
    await build(options.config ?? "")
  })

program
  .command(Commands.WATCH)
  .summary("Watch for changes and rebuild")
  .option("--config <config>", configSummary)
  .action(async (options) => {
    await watch(options.config ?? "")
  })

program.showHelpAfterError(true)

const commands: string[] = Object.values(Commands)

if (
  process.argv.length < 3 ||
  !process.argv.slice(2).some((arg) => commands.includes(arg))
) {
  // show help if the user did not enter a valid command
  program.help()
} else {
  program.parse()
}
