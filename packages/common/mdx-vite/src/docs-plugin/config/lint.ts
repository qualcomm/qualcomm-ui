// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QuiDocsLintOptions, SearchIndexerOptions} from "./types.js"

/**
 * Applies lint defaults. The deprecated `validatePageLinks: false` maps to
 * `brokenLinks: "off"` unless `lint.brokenLinks` is set explicitly.
 */
export function resolveLintOptions(
  config: Pick<SearchIndexerOptions, "lint" | "validatePageLinks">,
): Required<QuiDocsLintOptions> {
  return {
    brokenLinks:
      config.lint?.brokenLinks ??
      (config.validatePageLinks === false ? "off" : "warn"),
    pageTitle: config.lint?.pageTitle ?? "warn",
  }
}
