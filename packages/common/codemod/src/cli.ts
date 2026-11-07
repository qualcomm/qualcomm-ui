// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Argument, Help, Option, program} from "@commander-js/extra-typings"

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

const forceOption = new Option(
  "--force",
  "Run every codemod, even if its packages aren't installed or are older than the versions it migrates from, and skip safety checks that cancel the migration",
)

const help = new Help()

function indent(text: string, spaces: number): string {
  return text.replace(/^/gm, " ".repeat(spaces))
}

const availableMigrations = migrationGroups
  .map((group) =>
    [
      `  ${group.name}`,
      indent(help.boxWrap(group.description, 76), 4),
      ...(group.warning
        ? [indent(help.boxWrap(`Warning: ${group.warning}`, 76), 4)]
        : []),
    ].join("\n"),
  )
  .join("\n\n")

program
  .name("npx @qualcomm-ui/codemod@latest")
  .command("migrate")
  .addArgument(migrationArgument)
  .addOption(directoryOption)
  .addOption(logModeOpt)
  .addOption(dryRunOption)
  .addOption(forceOption)
  .usage("[options] <migration>")
  .summary("Run migrations for QUI packages")
  .description(
    `Migrate a project to the latest major versions of QUI packages.

Package versions are detected from package.json (falling back to the installed
version). Every codemod for the detected versions is applied in order, including
on projects that are already upgraded, and package.json is updated to the new
major versions. Use --force to run every codemod whatever versions are detected,
e.g. in a package that doesn't list the migrated packages as dependencies.
--force also skips safety checks, such as qds-v2-tokens cancelling the
migration when the project already uses v2 tokens.`,
  )
  .addHelpText(
    "after",
    `
Available migrations:

${availableMigrations}

Examples:
  npx @qualcomm-ui/codemod@latest migrate qui-docs
  npx @qualcomm-ui/codemod@latest migrate qui-docs -d apps/docs --dry-run
  npx @qualcomm-ui/codemod@latest migrate qds-v2-tokens --force`,
  )
  .action(async (migration, opts, command) => {
    if (!migration) {
      command.help()
    }
    const group = migrationGroups.find((group) => group.name === migration)!
    await runMigration(group, {
      dir: opts.dir,
      dryRun: opts.dryRun ?? false,
      force: opts.force ?? false,
      logMode: opts.logMode,
    })
  })

program.parse(process.argv)
