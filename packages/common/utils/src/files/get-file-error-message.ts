// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FileError} from "./types.js"

const FILE_ERROR_MESSAGES: Record<string, string> = {
  FILE_EXISTS: "File already exists",
  FILE_INVALID: "Invalid file",
  FILE_INVALID_TYPE: "Invalid file type",
  FILE_TOO_LARGE: "File is too large",
  FILE_TOO_SMALL: "File is too small",
  TOO_MANY_FILES: "Too many files",
}

/**
 * Returns a human-readable error message for the given file errors.
 * Uses the first error in the array if multiple are provided.
 */
export function getFileErrorMessage(errors: FileError[]): string {
  if (!errors || errors.length === 0) {
    return "Unknown error"
  }

  const firstError = errors[0]
  return FILE_ERROR_MESSAGES[firstError] || firstError
}
