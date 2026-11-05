// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type Calendar,
  type DateValue,
  getLocalTimeZone,
  toCalendar,
  toCalendarDateTime,
  today,
} from "@internationalized/date"

import {constrainValue} from "./constrain.js"
import type {DateAvailableFn} from "./types.js"

export function getTodayDate(
  timeZone?: string,
  calendar?: Calendar,
): DateValue {
  const tod = today(timeZone ?? getLocalTimeZone())
  if (calendar) {
    return toCalendar(tod, calendar)
  }
  return tod
}

export function setCalendar(date: DateValue, calendar: Calendar): DateValue {
  return toCalendar(toCalendarDateTime(date), calendar)
}

export function setDate(
  date: DateValue,
  startDate: DateValue,
  isDateUnavailable: DateAvailableFn,
  locale: string,
  minValue: DateValue,
  maxValue: DateValue,
): DateValue | undefined {
  const result = constrainValue(date, minValue, maxValue)
  return getPreviousAvailableDate(result, startDate, locale, isDateUnavailable)
}

export function getPreviousAvailableDate(
  date: DateValue,
  minValue: DateValue,
  locale: string,
  isDateUnavailable?: DateAvailableFn,
): DateValue | undefined {
  if (!isDateUnavailable) {
    return date
  }

  while (date.compare(minValue) >= 0 && isDateUnavailable(date, locale)) {
    date = date.subtract({days: 1})
  }

  if (date.compare(minValue) >= 0) {
    return date
  }
}
