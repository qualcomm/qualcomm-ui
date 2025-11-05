// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {readdir} from "node:fs/promises"

export function getArg(argv: any[], key: string): string | undefined {
  const index = argv.indexOf(key)
  if (index !== -1) {
    return argv[index + 1]
  }
  return undefined
}

export function hasArg(argv: any[], key: string): boolean {
  return argv.includes(key)
}

export async function collectFolders(filePath: string): Promise<string[]> {
  const dirNames = await readdir(filePath, {withFileTypes: true})

  // Create an object with output names as keys and entry points as values
  return dirNames
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
}
