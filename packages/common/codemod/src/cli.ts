// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Option, program} from "@commander-js/extra-typings"
import {writeFile} from "node:fs/promises"

import {modImports} from "./mod-imports"
import {
  angular,
  base,
  ExportAnalyzer,
  mdxDocs,
  react,
  reactRouterUtils,
  reactTableTransforms,
} from "./modules"
import type {ImportTransformEntry} from "./transformers"

const logModeOpt = new Option("--log-mode <logMode>", "Log mode")
  .choices(["info", "verbose"])
  .default("info")

const directoryOption = new Option(
  "-d, --dir <directory>",
  "Directory to process (supports file globs)",
).makeOptionMandatory()

function addMigration(name: string, transforms: ImportTransformEntry[]) {
  return program
    .command(name)
    .addOption(directoryOption)
    .addOption(logModeOpt)
    .summary(`Update @qui/${name} imports to the latest version`)
    .action(async (opts) => {
      return modImports(transforms, opts)
    })
}

addMigration("angular", angular)
addMigration("react", react)
addMigration("base", base)
addMigration("mdx-docs", mdxDocs)
addMigration("react-router-utils", reactRouterUtils)
addMigration("react-table", reactTableTransforms)

program
  .command("analyze-exports")
  .addOption(directoryOption)
  .option(
    "-p, --package-name <packageName>",
    "Package name, used to generate migration config",
  )
  .action(async (opts) => {
    const analyzer = new ExportAnalyzer().analyzeDirectory(opts.dir)
    if (opts.packageName) {
      const config = analyzer.createMigrationConfig(opts.packageName)
      await writeFile(
        "./migration-config.json",
        JSON.stringify(config, null, 2),
        "utf-8",
      )
    } else {
      analyzer.printReport()
    }
  })

program.parse(process.argv)
