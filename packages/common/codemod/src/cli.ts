// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Argument, Option, program} from "@commander-js/extra-typings"

import {migrationGroups, runMigration} from "./migrations/index.js"

const migrationArgument = new Argument(
  "[migration]",
  "Migration to run",
).choices(migrationGroups.map((group) => group.name))

const directoryOption = new Option(
  "-d, --dir <directory>",
  "Project root containing package.json",
).default(".")

const logModeOpt = new Option("--log-mode <logMode>", "Log mode")
  .choices(["info", "verbose"] as const)
  .default("info" as const)

const dryRunOption = new Option(
  "--dry-run",
  "Preview changes without writing files",
)

const nameWidth = Math.max(...migrationGroups.map((group) => group.name.length))

const availableMigrations = migrationGroups
  .map((group) =>
    [
      `  ${group.name.padEnd(nameWidth)}  ${group.description}`,
      ...group.packages.map((name) => `${" ".repeat(nameWidth + 4)}- ${name}`),
    ].join("\n"),
  )
  .join("\n")

program
  .name("npx @qualcomm-ui/codemod@latest")
  .command("migrate")
  .addArgument(migrationArgument)
  .addOption(directoryOption)
  .addOption(logModeOpt)
  .addOption(dryRunOption)
  .usage("[options] <migration>")
  .summary("Run migrations for QUI packages")
  .description(
    `Migrate a project to the latest major versions of QUI packages.

Package versions are detected from package.json (falling back to the installed
version). Every codemod for the detected versions is applied in order, including
on projects that are already upgraded, and package.json is updated to the new
major versions.

Available migrations:
${availableMigrations}

Examples:
  npx @qualcomm-ui/codemod@latest migrate qui-docs
  npx @qualcomm-ui/codemod@latest migrate qui-docs -d apps/docs --dry-run`,
  )
  .action(async (migration, opts, command) => {
    if (!migration) {
      command.help()
    }
    const group = migrationGroups.find((group) => group.name === migration)!
    await runMigration(group, {
      dir: opts.dir,
      dryRun: opts.dryRun ?? false,
      logMode: opts.logMode,
    })
  })

program.parse(process.argv)
