// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  DateValue,
  DatePickerDateView,
  DatePickerSelectionMode,
} from "@qualcomm-ui/core/date-picker"

export const datePickerViewColumns: Record<DatePickerDateView, number> = {
  day: 7,
  month: 4,
  year: 4,
}

export const datePickerHeadlineFormat: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  weekday: "short",
  year: "numeric",
}

export const datePickerHeadlineRangeFormat: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
}

export interface DatePickerHeadlineValueOptions {
  /** Locale-aware formatter from the date picker api. */
  format: (value: DateValue, options?: Intl.DateTimeFormatOptions) => string

  formatOptions?: Intl.DateTimeFormatOptions

  moreLabel?: (count: number) => string

  placeholder?: string

  rangePlaceholder?: [string, string]

  selectionMode: DatePickerSelectionMode

  value: (DateValue | null)[]
}

/**
 * Builds the human readable headline text for the current selection.
 */
export function getDatePickerHeadlineValueText({
  format,
  formatOptions,
  moreLabel = (count) => `+${count} more`,
  placeholder = "Select date",
  rangePlaceholder = ["Start", "End"],
  selectionMode,
  value,
}: DatePickerHeadlineValueOptions): string {
  if (selectionMode === "range") {
    const options = formatOptions ?? datePickerHeadlineRangeFormat
    const [start, end] = value
    const startText = start ? format(start, options) : rangePlaceholder[0]
    const endText = end ? format(end, options) : rangePlaceholder[1]
    return `${startText} - ${endText}`
  }

  if (selectionMode === "multiple") {
    const dates = value.filter((date): date is DateValue => date != null)
    if (dates.length === 0) {
      return placeholder
    }
    const options = formatOptions ?? datePickerHeadlineRangeFormat
    if (dates.length <= 2) {
      return dates.map((date) => format(date, options)).join(", ")
    }
    return `${format(dates[0], options)} ${moreLabel(dates.length - 1)}`
  }

  const options = formatOptions ?? datePickerHeadlineFormat
  return value[0] ? format(value[0], options) : placeholder
}
