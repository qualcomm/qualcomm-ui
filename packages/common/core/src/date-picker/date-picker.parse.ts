// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {CalendarDate, type DateValue, parseDate} from "@internationalized/date"

type DateInput = string | Date

export function parse(value: DateInput): DateValue
export function parse(value: Array<DateInput>): DateValue[]
export function parse(
  value: DateInput | Array<DateInput>,
): DateValue | DateValue[] {
  if (Array.isArray(value)) {
    return value.map((v) => parse(v))
  }
  if (value instanceof Date) {
    return new CalendarDate(
      value.getFullYear(),
      value.getMonth() + 1,
      value.getDate(),
    )
  }
  return parseDate(value)
}
