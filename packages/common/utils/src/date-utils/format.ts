// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type DateFormatter,
  type DateValue,
  isSameDay,
} from "@internationalized/date"

import {getDayFormatter} from "./formatter.js"

export function formatRange(
  startDate: DateValue,
  endDate: DateValue,
  formatter: DateFormatter,
  toString: (start: string, end: string) => string,
  timeZone: string,
): string {
  const parts = formatter.formatRangeToParts(
    startDate.toDate(timeZone),
    endDate.toDate(timeZone),
  )
  let separatorIndex = -1
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (part.source === "shared" && part.type === "literal") {
      separatorIndex = i
    } else if (part.source === "endRange") {
      break
    }
  }
  let start = ""
  let end = ""
  for (let i = 0; i < parts.length; i++) {
    if (i < separatorIndex) {
      start += parts[i].value
    } else if (i > separatorIndex) {
      end += parts[i].value
    }
  }
  return toString(start, end)
}

export function formatSelectedDate(
  startDate: DateValue | null | undefined,
  endDate: DateValue | null,
  locale: string,
  timeZone: string,
): string {
  if (!startDate) {
    return ""
  }
  const start = startDate
  const end = endDate ?? startDate
  const formatter = getDayFormatter(locale, timeZone)
  if (isSameDay(start, end)) {
    return formatter.format(start.toDate(timeZone))
  }
  return formatRange(
    start,
    end,
    formatter,
    (start, end) => `${start} - ${end}`,
    timeZone,
  )
}
