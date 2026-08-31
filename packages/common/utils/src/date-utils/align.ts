// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DateDuration, DateValue} from "@internationalized/date"

import {alignCenter, alignEnd, alignStart} from "./constrain.js"
import type {DateAlignment} from "./types.js"

export function alignDate(
  date: DateValue,
  alignment: DateAlignment,
  duration: DateDuration,
  locale: string,
  min?: DateValue,
  max?: DateValue,
): DateValue {
  switch (alignment) {
    case "start":
      return alignStart(date, duration, locale, min, max)
    case "end":
      return alignEnd(date, duration, locale, min, max)
    case "center":
    default:
      return alignCenter(date, duration, locale, min, max)
  }
}
