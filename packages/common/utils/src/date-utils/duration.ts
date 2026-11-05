// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DateDuration, DateValue} from "@internationalized/date"

export function getUnitDuration(duration: DateDuration): DateDuration {
  const clone = {...duration}
  for (const key in clone) {
    clone[key as keyof typeof clone] = 1
  }
  return clone
}

export function getEndDate(
  startDate: DateValue,
  duration: DateDuration,
): DateValue {
  const clone = {...duration}
  if (clone.days) {
    clone.days--
  } else {
    clone.days = -1
  }
  return startDate.add(clone)
}
