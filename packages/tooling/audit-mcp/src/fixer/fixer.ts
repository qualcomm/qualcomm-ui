// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FixEdit} from "@qualcomm-ui/audit-mcp/rules"

/**
 * Applies a list of non-overlapping `FixEdit`s to a source string.
 *
 * Edits are sorted by descending `start` so later applications do not shift
 * offsets of earlier ones. Overlapping edits are a programmer error and throw.
 */
export function applyFixEdits(
  source: string,
  edits: readonly FixEdit[],
): string {
  const sorted = [...edits].sort((a, b) => b.start - a.start)

  for (let i = 0; i < sorted.length - 1; i += 1) {
    const current = sorted[i]
    const next = sorted[i + 1]
    if (next.end > current.start) {
      throw new Error(
        `Overlapping fix edits: [${next.start}, ${next.end}) vs [${current.start}, ${current.end})`,
      )
    }
  }

  let result = source
  for (const edit of sorted) {
    result =
      result.slice(0, edit.start) + edit.replacement + result.slice(edit.end)
  }
  return result
}
