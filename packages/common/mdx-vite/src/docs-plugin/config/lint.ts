// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QuiDocsLintOptions, SearchIndexerOptions} from "./types.js"

/**
 * Applies lint defaults.
 */
export function resolveLintOptions(
  config: Pick<SearchIndexerOptions, "lint">,
): Required<QuiDocsLintOptions> {
  return {
    brokenLinks: config.lint?.brokenLinks ?? "warn",
    fileLinks: config.lint?.fileLinks ?? "off",
    pageTitle: config.lint?.pageTitle ?? "warn",
  }
}
