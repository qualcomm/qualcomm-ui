// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

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
