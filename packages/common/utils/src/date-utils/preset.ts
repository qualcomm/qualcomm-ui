// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type DateValue,
  endOfMonth,
  endOfWeek,
  endOfYear,
  now,
  startOfMonth,
  startOfWeek,
  startOfYear,
  toCalendarDate,
} from "@internationalized/date"

import type {DateRangePreset} from "./types.js"

export function getDateRangePreset(
  preset: DateRangePreset,
  locale: string,
  timeZone: string,
): [DateValue, DateValue] {
  // Convert ZonedDateTime to CalendarDate to ensure consistent date type without
  // time components. This prevents issues with mixed date types in comparisons and
  // range operations.
  const today = toCalendarDate(now(timeZone))

  switch (preset) {
    case "thisWeek":
      return [startOfWeek(today, locale), endOfWeek(today, locale)]
    case "thisMonth":
      return [startOfMonth(today), today]
    case "thisQuarter":
      return [
        startOfMonth(today).add({months: -((today.month - 1) % 3)}),
        today,
      ]
    case "thisYear":
      return [startOfYear(today), today]
    case "last3Days":
      return [today.add({days: -2}), today]
    case "last7Days":
      return [today.add({days: -6}), today]
    case "last14Days":
      return [today.add({days: -13}), today]
    case "last30Days":
      return [today.add({days: -29}), today]
    case "last90Days":
      return [today.add({days: -89}), today]
    case "lastMonth":
      return [
        startOfMonth(today.add({months: -1})),
        endOfMonth(today.add({months: -1})),
      ]
    case "lastQuarter":
      return [
        startOfMonth(today.add({months: -((today.month - 1) % 3) - 3})),
        endOfMonth(today.add({months: -((today.month - 1) % 3) - 1})),
      ]
    case "lastWeek":
      return [
        startOfWeek(today, locale).add({weeks: -1}),
        endOfWeek(today, locale).add({weeks: -1}),
      ]
    case "lastYear":
      return [
        startOfYear(today.add({years: -1})),
        endOfYear(today.add({years: -1})),
      ]
    case "next3Days":
      return [today, today.add({days: 2})]
    case "next7Days":
      return [today, today.add({days: 6})]
    case "next14Days":
      return [today, today.add({days: 13})]
    case "next30Days":
      return [today, today.add({days: 29})]
    case "next90Days":
      return [today, today.add({days: 89})]
    case "nextMonth":
      return [
        startOfMonth(today.add({months: 1})),
        endOfMonth(today.add({months: 1})),
      ]
    case "nextQuarter":
      return [
        startOfMonth(today.add({months: -((today.month - 1) % 3) + 3})),
        endOfMonth(today.add({months: -((today.month - 1) % 3) + 5})),
      ]
    case "nextWeek":
      return [
        startOfWeek(today, locale).add({weeks: 1}),
        endOfWeek(today, locale).add({weeks: 1}),
      ]
    case "nextYear":
      return [
        startOfYear(today.add({years: 1})),
        endOfYear(today.add({years: 1})),
      ]
    default:
      throw new Error(`Invalid date range preset: ${preset as string}`)
  }
}
