// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import {relative} from "node:path"

import {fixPath} from "./path-utils.js"

export interface FileIssues {
  /**
   * Path to the file, or a label for issues that don't come from a file on disk,
   * like the qui-docs config's `navConfig`.
   */
  filePath: string
  messages: string[]
}

export function formatPath(filePath: string): string {
  return fixPath(relative(process.cwd(), filePath))
}

export function pluralize(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`
}

/**
 * Logs issues to the console grouped by file.
 */
export function reportFileIssues(
  issues: FileIssues[],
  title: string,
  color: typeof chalk.redBright,
): void {
  if (!issues.length) {
    return
  }
  console.debug(`\n${color.bold(title)}`)
  for (const {filePath, messages} of issues) {
    console.debug(`\n  ${chalk.blueBright.bold(filePath)}`)
    for (const message of messages) {
      console.debug(`    ${color("x")} ${message}`)
    }
  }
  console.debug("")
}
