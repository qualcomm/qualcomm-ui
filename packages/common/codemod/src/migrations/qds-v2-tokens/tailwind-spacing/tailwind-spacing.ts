// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type MigrateScalesOptions,
  migrateScales,
  type ScaleMigrationResult,
  TAILWIND_SPACING_SCALE,
  type TokenScale,
} from "../token-scales.js"

export const TAILWIND_SCALES: readonly TokenScale[] = [TAILWIND_SPACING_SCALE]

/**
 * Renames the legacy Tailwind spacing utilities (`p-qds-40`) and theme
 * variables (`--spacing-qds-40`) to the steps with the same pixel value. Border
 * radius utilities keep their names and values, so they aren't changed.
 */
export function transformTailwindSpacing(
  content: string,
  options?: MigrateScalesOptions,
): ScaleMigrationResult {
  return migrateScales(content, TAILWIND_SCALES, options)
}
