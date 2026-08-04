// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {minimatch} from "minimatch"

import type {KnowledgeFrontmatterConfig} from "../../config/index.js"

export function filterFrontmatter(
  frontmatter: Record<string, unknown>,
  config: KnowledgeFrontmatterConfig | undefined,
): Record<string, unknown> {
  if (!config?.include?.length) {
    return frontmatter
  }

  const includePatterns = config.include
  const excludePatterns = config.exclude ?? []
  const filtered: Record<string, unknown> = {}

  for (const [field, value] of Object.entries(frontmatter)) {
    if (value === undefined) {
      continue
    }
    const isIncluded = includePatterns.some((pattern) =>
      minimatch(field, pattern),
    )
    const isExcluded = excludePatterns.some((pattern) =>
      minimatch(field, pattern),
    )
    if (isIncluded && !isExcluded) {
      filtered[field] = value
    }
  }

  return filtered
}
