// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  DateFormatter,
  type DateValue,
  toCalendarDateTime,
  today,
} from "@internationalized/date"

import {getEraFormat} from "./get-era-format.js"

export function getDayFormatter(
  locale: string,
  timeZone: string,
  referenceDate?: DateValue,
): DateFormatter {
  const date = referenceDate ?? toCalendarDateTime(today(timeZone))
  return new DateFormatter(locale, {
    calendar: date.calendar.identifier,
    day: "numeric",
    era: getEraFormat(date),
    month: "long",
    timeZone,
    weekday: "long",
    year: "numeric",
  })
}

export function getMonthFormatter(
  locale: string,
  timeZone: string,
  referenceDate?: DateValue,
): DateFormatter {
  const date = referenceDate ?? today(timeZone)
  return new DateFormatter(locale, {
    calendar: date.calendar.identifier,
    era: getEraFormat(date),
    month: "long",
    timeZone,
    year: "numeric",
  })
}
