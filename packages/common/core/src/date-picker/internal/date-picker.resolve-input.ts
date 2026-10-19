// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DateValue} from "@internationalized/date"

import {constrainValue} from "@qualcomm-ui/utils/date-utils"

import type {
  DatePickerApiProps,
  DatePickerLocaleDetails,
} from "../date-picker.types.js"
import {isValidDate} from "../date-picker.utils.js"

/**
 * `parsed` is the date as typed; `committed` is it constrained to `min`/`max`.
 */
export type DatePickerInputResolution =
  | {
      committed: DateValue
      kind: "accepted"
      parsed: DateValue
    }
  | {
      kind: "invalid"
      parsed: null
    }
  | {
      kind: "unavailable"
      parsed: DateValue
    }

export interface ResolveDatePickerInputOptions
  extends
    DatePickerLocaleDetails,
    Pick<DatePickerApiProps, "isDateUnavailable" | "max" | "min"> {
  parse: NonNullable<DatePickerApiProps["parse"]>
}

/**
 * Parses a typed input string once so the focus and selection paths share a
 * single invocation of the consumer supplied `parse`.
 */
export function resolveDatePickerInput(
  value: string,
  options: ResolveDatePickerInputOptions,
): DatePickerInputResolution {
  const {isDateUnavailable, locale, max, min, parse, timeZone} = options

  const parsed = parse(value, {locale, timeZone})
  if (!parsed || !isValidDate(parsed)) {
    return {kind: "invalid", parsed: null}
  }

  const committed = constrainValue(parsed, min, max)
  if (isDateUnavailable?.(committed, locale)) {
    return {kind: "unavailable", parsed}
  }

  return {committed, kind: "accepted", parsed}
}
