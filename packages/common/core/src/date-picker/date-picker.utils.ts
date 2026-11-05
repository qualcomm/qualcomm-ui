// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {DateFormatter, type DateValue} from "@internationalized/date"

import {getDecadeRange} from "@qualcomm-ui/utils/date-utils"
import {match} from "@qualcomm-ui/utils/functions"
import {clampValue} from "@qualcomm-ui/utils/number"

import type {
  DatePickerDateView,
  DatePickerIntlTranslations,
  DatePickerSelectionMode,
  DatePickerVisibleRangeText,
} from "./date-picker.types.js"

export function adjustStartAndEndDate(
  value: (DateValue | null)[],
): (DateValue | null)[] {
  const [startDate, endDate] = value
  if (!startDate || !endDate) {
    return value
  }
  return startDate.compare(endDate) <= 0 ? value : [endDate, startDate]
}

/**
 * Range preserves positional holes (`[null, end]`) by design
 */
export function normalizeValueForMode(
  values: (DateValue | null)[],
  mode: DatePickerSelectionMode,
): (DateValue | null)[] {
  if (mode === "single") {
    return values.filter((date) => date != null).slice(0, 1)
  }
  if (mode === "multiple") {
    return values.filter((date) => date != null)
  }
  return adjustStartAndEndDate(values.slice(0, 2))
}

export function isDateWithinRange(
  date: DateValue,
  value: (DateValue | null)[],
): boolean {
  const [startDate, endDate] = value
  if (!startDate || !endDate) {
    return false
  }
  return startDate.compare(date) <= 0 && endDate.compare(date) >= 0
}

export function sortDates(values: (DateValue | null)[]): (DateValue | null)[] {
  if (values.some((date) => date == null)) {
    return values.slice()
  }
  return values.slice().sort((a, b) => a!.compare(b!))
}

export function getRoleDescription(view: DatePickerDateView): string {
  return match(view, {
    day: "calendar month",
    month: "calendar year",
    year: "calendar decade",
  })
}

const PLACEHOLDERS: Record<string, string> = {
  day: "dd",
  month: "mm",
  year: "yyyy",
}

export function getInputPlaceholder(locale: string): string {
  return new DateFormatter(locale)
    .formatToParts(new Date())
    .map((item) => PLACEHOLDERS[item.type] ?? item.value)
    .join("")
}

export const isValidDate = (value: DateValue): boolean => {
  return (
    !Number.isNaN(value.day) &&
    !Number.isNaN(value.month) &&
    !Number.isNaN(value.year)
  )
}

export const defaultTranslations: Required<DatePickerIntlTranslations> = {
  clearTrigger: "Clear selected dates",
  content: "calendar",
  dayCell(state) {
    if (state.unavailable) {
      return `Not available. ${state.valueText}`
    }
    if (state.firstInRange) {
      return `Starting range from ${state.valueText}`
    }
    if (state.lastInRange) {
      return `Range ending at ${state.valueText}`
    }
    if (state.selected) {
      return `Selected date. ${state.valueText}`
    }
    return `Choose ${state.valueText}`
  },
  errorIndicator: "Error",
  inputDescription(format) {
    return `Date format: ${format}`
  },
  nextTrigger(view) {
    return match(view, {
      day: "Switch to next month",
      month: "Switch to next year",
      year: "Switch to next decade",
    })
  },
  // TODO: Revisit this
  placeholder() {
    return {day: "dd", month: "mm", year: "yyyy"}
  },
  presetsTrigger(open) {
    return open ? "Show calendar" : "Show presets"
  },
  presetTrigger(value) {
    const [start = "", end = ""] = value
    return `select ${start} to ${end}`
  },
  prevTrigger(view) {
    return match(view, {
      day: "Switch to previous month",
      month: "Switch to previous year",
      year: "Switch to previous decade",
    })
  },
  rangeInputEnd: "End date",
  rangeInputStart: "Start date",
  trigger(state) {
    if (state.open) {
      return "Close calendar"
    }
    const [start, end] = state.valueText
    if (state.selectionMode === "multiple") {
      const count = state.valueText.filter(Boolean).length
      return count ? `Change dates, ${count} selected` : "Choose dates"
    }
    if (state.selectionMode === "range") {
      if (start && end) {
        return `Change date range, ${start} to ${end}`
      }
      if (start) {
        return `Change date range, from ${start}`
      }
      if (end) {
        return `Change date range, until ${end}`
      }
      return "Choose date range"
    }
    return start ? `Change date, ${start}` : "Choose date"
  },
  viewCloseTrigger: "Return to calendar",
  viewTrigger(view, targetView) {
    if (targetView) {
      return match(targetView, {
        day: "Switch to day view",
        month: "Switch to month view",
        year: "Switch to year view",
      })
    }
    return match(view, {
      day: "Switch to year view",
      month: "Switch to day view",
      year: "Switch to month view",
    })
  },
}

// 0 – day, 1 – month, 2 – year;
type DateViewNumber = 0 | 1 | 2

function viewToNumber(
  view: DatePickerDateView | undefined,
  fallback: DateViewNumber | undefined,
): DateViewNumber {
  if (!view) {
    return fallback || 0
  }
  return view === "day" ? 0 : view === "month" ? 1 : 2
}

function viewNumberToView(
  viewNumber: DateViewNumber | undefined,
): DatePickerDateView {
  return viewNumber === 0 ? "day" : viewNumber === 1 ? "month" : "year"
}

export function clampView(
  view: DatePickerDateView | undefined,
  minView: DatePickerDateView | undefined,
  maxView: DatePickerDateView | undefined,
): DatePickerDateView {
  return viewNumberToView(
    clampValue(
      viewToNumber(view, 0),
      viewToNumber(minView, 0),
      viewToNumber(maxView, 2),
    ) as DateViewNumber,
  )
}

export function isAboveMinView(
  view: DatePickerDateView,
  minView: DatePickerDateView,
): boolean {
  return viewToNumber(view, 0) > viewToNumber(minView, 0)
}

export function isBelowMinView(
  view: DatePickerDateView,
  minView: DatePickerDateView,
): boolean {
  return viewToNumber(view, 0) < viewToNumber(minView, 0)
}

export function getNextView(
  view: DatePickerDateView,
  minView: DatePickerDateView,
  maxView: DatePickerDateView,
): DatePickerDateView {
  const nextViewNumber = clampValue(
    viewToNumber(view, 0) + 1,
    0,
    2,
  ) as DateViewNumber
  return clampView(viewNumberToView(nextViewNumber), minView, maxView)
}

export function getPreviousView(
  view: DatePickerDateView,
  minView: DatePickerDateView,
  maxView: DatePickerDateView,
): DatePickerDateView {
  const prevViewNumber = clampValue(
    viewToNumber(view, 0) - 1,
    0,
    2,
  ) as DateViewNumber
  return clampView(viewNumberToView(prevViewNumber), minView, maxView)
}

const views: DatePickerDateView[] = ["day", "month", "year"]
export function eachView(cb: (view: DatePickerDateView) => void): void {
  for (const view of views) {
    cb(view)
  }
}

interface VisibleRangeTextOptions {
  endValue: DateValue
  locale: string
  startValue: DateValue
  timeZone: string
  view: DatePickerDateView
}

export function getVisibleRangeText(
  opts: VisibleRangeTextOptions,
): DatePickerVisibleRangeText {
  const {endValue, locale, startValue, timeZone, view} = opts

  if (view === "year") {
    const years = getDecadeRange(startValue.year, {strict: true})
    const start = years.at(0)!.toString()
    const end = years.at(-1)!.toString()
    return {end, formatted: `${start} - ${end}`, start}
  }

  const formatter = new DateFormatter(locale, {
    calendar: startValue.calendar.identifier,
    ...(view === "month" ? {} : {month: "long"}),
    timeZone,
    year: "numeric",
  })
  const start = formatter.format(startValue.toDate(timeZone))
  const end = formatter.format(endValue.toDate(timeZone))
  const formatted = start === end ? start : `${start} - ${end}`
  return {end, formatted, start}
}
