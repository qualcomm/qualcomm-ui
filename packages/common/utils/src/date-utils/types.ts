// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DateFormatter, DateValue} from "@internationalized/date"

export type DateGranularity =
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "year"
  | "month"
export type DateAlignment = "start" | "end" | "center"

export type GetFormatterFn = (
  options: Intl.DateTimeFormatOptions,
) => DateFormatter
export type DateAvailableFn = (date: DateValue, locale: string) => boolean
export type GetPlaceholderFn = (options: {
  field: string
  locale: string
}) => string
export type DateAdjustFn = (options: {
  focusedDate: DateValue
  startDate: DateValue
}) => {
  endDate: DateValue
  focusedDate: DateValue
  startDate: DateValue
}
export type DateFormatOptions = Intl.ResolvedDateTimeFormatOptions

export type DateRangePreset =
  | "thisWeek"
  | "lastWeek"
  | "nextWeek"
  | "thisMonth"
  | "lastMonth"
  | "nextMonth"
  | "thisQuarter"
  | "lastQuarter"
  | "nextQuarter"
  | "thisYear"
  | "lastYear"
  | "nextYear"
  | "last3Days"
  | "last7Days"
  | "last14Days"
  | "last30Days"
  | "last90Days"
  | "next3Days"
  | "next7Days"
  | "next14Days"
  | "next30Days"
  | "next90Days"
