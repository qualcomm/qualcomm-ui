// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import {
  cpSync,
  existsSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs"
import {resolve} from "node:path"

enum Commands {
  PRE_PUBLISH = "pre-publish",
  POST_PUBLISH = "post-publish",
}

export function prePublish(pkgPath: string, pkgBackupPath: string) {
  cpSync(pkgPath, pkgBackupPath)
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"))

  // pull out devDependencies and scripts
  const {
    devDependencies: _devDependencies,
    scripts: _scripts,
    ...formattedPkg
  } = pkg

  writeFileSync(pkgPath, JSON.stringify(formattedPkg, null, 2), "utf-8")
}

export function postPublish(pkgPath: string, pkgBackupPath: string) {
  if (existsSync(pkgBackupPath)) {
    renameSync(pkgBackupPath, pkgPath)
  }
}

export function addPublishCommands() {
  program
    .command(Commands.PRE_PUBLISH)
    .option("--pkg <pkg>", "Path to package.json", "package.json")
    .option(
      "--backup <backup>",
      `Path to the backup file for restoring the original package.json`,
      "pkg-json-backup.json",
    )
    .summary(
      "Prepare this module for publishing. Removes devDependencies and scripts.",
    )
    .action(async ({backup, pkg}) => {
      prePublish(resolve(pkg), resolve(backup))
    })

  program
    .command(Commands.POST_PUBLISH)
    .option("--pkg <pkg>", "Path to package.json", "package.json")
    .option(
      "--backup <backup>",
      `Path to the backup file for restoring the original package.json`,
      "pkg-json-backup.json",
    )
    .summary(
      `Restore the package.json from the ${Commands.PRE_PUBLISH} command. Run this after ${Commands.PRE_PUBLISH}.`,
    )
    .action(async ({backup, pkg}) => {
      postPublish(resolve(pkg), resolve(backup))
    })
}
