// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  CalendarDate,
  DateFormatter,
  type DateValue,
} from "@internationalized/date"

import {normalizeYear} from "./date-year.js"

const isValidYear = (year: string | null | undefined): year is string =>
  year != null && year.length === 4
const isValidMonth = (month: string | null | undefined): month is string =>
  month != null && parseFloat(month) <= 12
const isValidDay = (day: string | null | undefined): day is string =>
  day != null && parseFloat(day) <= 31

export function parseDateString(
  date: string,
  locale: string,
  timeZone: string,
): DateValue | undefined {
  const regex = createRegex(locale, timeZone)

  let {day, month, year} = extract(regex, date) ?? {}

  const hasMatch = year != null || month != null || day != null

  if (hasMatch) {
    const curr = new Date()
    year ||= curr.getFullYear().toString()
    month ||= (curr.getMonth() + 1).toString()
    day ||= curr.getDate().toString()
  }

  if (!isValidYear(year)) {
    year = normalizeYear(year)
  }

  if (isValidYear(year) && isValidMonth(month) && isValidDay(day)) {
    const parsed = new CalendarDate(+year, +month, +day)
    // Reject impossible dates rather than keep the coerced ones.
    if (parsed.month === +month && parsed.day === +day) {
      return parsed
    }
  }
}

function createRegex(locale: string, timeZone: string) {
  const formatter = new DateFormatter(locale, {
    day: "numeric",
    month: "numeric",
    timeZone,
    year: "numeric",
  })
  const parts = formatter.formatToParts(new Date(2000, 11, 25))
  return parts
    .map(({type, value}) =>
      type === "literal" ? `${value}?` : `((?!=<${type}>)\\d+)?`,
    )
    .join("")
}

interface DateParts {
  day: string | null
  month: string | null
  year: string | null
}

type DatePart = keyof DateParts

function extract(pattern: string | RegExp, str: string) {
  const matches = str.match(pattern)
  return pattern
    .toString()
    .match(/<(.+?)>/g)
    ?.map((group) => {
      const groupMatches = group.match(/<(.+)>/)
      if (!groupMatches || groupMatches.length <= 0) {
        return null
      }
      return group.match(/<(.+)>/)?.[1]
    })
    .reduce((acc, curr, index) => {
      if (!curr) {
        return acc
      }
      if (matches && matches.length > index) {
        acc[curr as DatePart] = matches[index + 1]
      } else {
        acc[curr as DatePart] = null
      }
      return acc
    }, {} as DateParts)
}
