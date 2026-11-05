// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  BORDER_RADIUS_SCALE,
  type MigrateScalesOptions,
  migrateScales,
  type ScaleMigrationResult,
  SIZING_SCALE,
  SPACING_SCALE,
  type TokenScale,
} from "../token-scales.js"

export const MEASUREMENT_SCALES: readonly TokenScale[] = [
  SPACING_SCALE,
  SIZING_SCALE,
  BORDER_RADIUS_SCALE,
]

/**
 * Renames the legacy `--spacing-*`, `--sizing-*`, and `--border-radius-*`
 * variables to the steps with the same pixel value.
 */
export function transformMeasurementTokens(
  content: string,
  options?: MigrateScalesOptions,
): ScaleMigrationResult {
  return migrateScales(content, MEASUREMENT_SCALES, options)
}
