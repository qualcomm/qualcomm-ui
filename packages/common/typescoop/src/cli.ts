// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"

import {build, init, watch} from "./internal/index.js"

const Commands = {
  EXTRACT: "extract",
  INIT: "init",
} as const

const configSummary =
  "relative path to the typescoop config file. See https://docs.qui.qualcomm.com/typescoop#configuration"

program
  .command(Commands.INIT)
  .summary("Initialize the config file")
  .action(async () => {
    return await init().catch(() => process.exit(0))
  })

program
  .command(Commands.EXTRACT)
  .summary("Extract types and write the documentation model")
  .option("-c, --config <config>", configSummary)
  .option("-w, --watch", "re-extract when a documented file changes")
  .action(async (options) => {
    if (options.watch) {
      await watch(options.config ?? "")
    } else {
      await build(options.config ?? "")
    }
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
