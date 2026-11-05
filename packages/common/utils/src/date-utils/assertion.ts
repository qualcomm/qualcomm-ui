// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type DateValue,
  endOfMonth,
  isSameDay,
  startOfMonth,
  toCalendarDateTime,
} from "@internationalized/date"

import type {DateAvailableFn} from "./types.js"

export function isDateEqual(
  dateA: DateValue | null | undefined,
  dateB?: DateValue | null,
): boolean {
  if (dateA == null || dateB == null) {
    return dateA === dateB
  }
  if (!("hour" in dateA) && !("hour" in dateB)) {
    return isSameDay(dateA, dateB)
  }
  return toCalendarDateTime(dateA).compare(toCalendarDateTime(dateB)) === 0
}

export function isDateUnavailable(
  date: DateValue | null,
  isUnavailable: DateAvailableFn | undefined,
  locale: string,
  minValue?: DateValue | null,
  maxValue?: DateValue | null,
): boolean {
  if (!date) {
    return false
  }
  if (isUnavailable?.(date, locale)) {
    return true
  }
  return isDateOutsideRange(date, minValue, maxValue)
}

export function isDateOutsideRange(
  date: DateValue,
  startDate?: DateValue | null,
  endDate?: DateValue | null,
): boolean {
  return (
    (startDate != null && date.compare(startDate) < 0) ||
    (endDate != null && date.compare(endDate) > 0)
  )
}

export function isMonthOutsideRange(
  date: DateValue,
  startDate?: DateValue | null,
  endDate?: DateValue | null,
): boolean {
  return (
    (startDate != null && endOfMonth(date).compare(startDate) < 0) ||
    (endDate != null && startOfMonth(date).compare(endDate) > 0)
  )
}

export function isPreviousRangeInvalid(
  startDate: DateValue,
  minValue?: DateValue | null,
  maxValue?: DateValue | null,
): boolean {
  const prevDate = startDate.subtract({days: 1})
  return (
    isSameDay(prevDate, startDate) ||
    isDateOutsideRange(prevDate, minValue, maxValue)
  )
}

export function isNextRangeInvalid(
  endDate: DateValue,
  minValue?: DateValue | null,
  maxValue?: DateValue | null,
): boolean {
  const nextDate = endDate.add({days: 1})
  return (
    isSameDay(nextDate, endDate) ||
    isDateOutsideRange(nextDate, minValue, maxValue)
  )
}
