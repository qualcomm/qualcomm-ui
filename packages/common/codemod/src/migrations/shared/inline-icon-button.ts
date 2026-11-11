// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {CodemodFileStatus} from "../types.js"

/**
 * InlineIconButton has a ghost appearance, but IconButton defaults to `fill`.
 * InlineIconButton's own `variant` (`fixed` or `scale`) sized its icon, which
 * compact IconButtons size by `size` instead, so it's replaced.
 */
export const COMPACT_DENSITY = `density="compact"`
export const GHOST_VARIANT = `variant="ghost"`

export interface InlineIconButtonResult {
  content: string
  /** Usages the codemod can't rewrite safely. */
  manual: string[]
  /** Number of InlineIconButton elements and references replaced. */
  replaced: number
  /**
   * - `updated`: InlineIconButton usages were replaced.
   * - `unchanged`: the file references InlineIconButton, but has nothing to
   *   replace.
   * - `skipped`: the file doesn't reference InlineIconButton.
   * - `conflict`: some usages must be updated manually. Other usages in the
   *   file may still have been updated.
   */
  status: CodemodFileStatus
}

export function getInlineIconButtonStatus(
  original: string,
  content: string,
  manual: string[],
): CodemodFileStatus {
  return manual.length
    ? "conflict"
    : content !== original
      ? "updated"
      : "unchanged"
}

/**
 * Returns the separator that puts a new attribute on its own line when the
 * attribute starting at `offset` is on its own line, or a space otherwise.
 */
export function getAttributeSeparator(content: string, offset: number): string {
  let start = offset
  while (
    start > 0 &&
    (content[start - 1] === " " || content[start - 1] === "\t")
  ) {
    start--
  }
  return content[start - 1] === "\n" ? `\n${content.slice(start, offset)}` : " "
}

export function describeInlineIconButtonResult(
  {manual, replaced, status}: InlineIconButtonResult,
  dryRun: boolean,
  skippedMessage: string,
): string {
  const usages = `${replaced} InlineIconButton ${replaced === 1 ? "usage" : "usages"}`
  const verb = dryRun ? "would replace" : "replaced"
  switch (status) {
    case "updated":
      return replaced
        ? `${verb} ${usages}`
        : `${dryRun ? "would update" : "updated"} the InlineIconButton imports`
    case "unchanged":
      return "no InlineIconButton usages found"
    case "skipped":
      return skippedMessage
    case "conflict":
      return `${replaced ? `${verb} ${usages}, ` : ""}update manually: ${manual.join("; ")}`
  }
}
