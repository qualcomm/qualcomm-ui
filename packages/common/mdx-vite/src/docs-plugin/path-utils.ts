// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {realpathSync} from "node:fs"

/**
 * Winblows fix
 */
export function fixPath(str: string): string {
  return str.replaceAll("\\", "/")
}

/**
 * Removes the trailing slash from a string.
 */
export function removeTrailingSlash(str: string): string {
  return str.endsWith("/") ? str.substring(0, str.length - 1) : str
}

/**
 * Resolves symlinks the same way Vite does for module IDs. Returns the input
 * path, normalized, if it does not exist.
 */
export function realPath(path: string): string {
  try {
    return fixPath(realpathSync(path))
  } catch {
    return fixPath(path)
  }
}
