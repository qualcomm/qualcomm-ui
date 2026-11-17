// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getDateRangePreset} from "@qualcomm-ui/utils/date-utils"

import type {
  DateFilterPreset,
  DateFilterPresetRange,
} from "./filters.definitions.js"

export interface ResolveDateFilterPresetOptions {
  /**
   * Locale that determines where weeks start for week presets.
   *
   * @default the runtime's locale
   */
  locale?: string | undefined

  /**
   * Time zone that determines the current date.
   *
   * @default the runtime's time zone
   */
  timeZone?: string | undefined
}

/**
 * Returns the `[start, end]` range of a date filter preset as of now. Presets
 * named after a date picker range preset resolve to ISO 8601 dates, with the
 * end date included in full.
 */
export function resolveDateFilterPreset(
  preset: DateFilterPreset,
  options: ResolveDateFilterPresetOptions = {},
): DateFilterPresetRange {
  if (preset.range) {
    return preset.range()
  }
  const resolved = new Intl.DateTimeFormat().resolvedOptions()
  const [start, end] = getDateRangePreset(
    preset.value,
    options.locale ?? resolved.locale,
    options.timeZone ?? resolved.timeZone,
  )
  return [start.toString(), end.toString()]
}
