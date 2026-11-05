// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DateValue} from "@internationalized/date"

export function getEraFormat(date: DateValue | undefined): "short" | undefined {
  if (!date) {
    return undefined
  }
  const id = date.calendar.identifier
  if (id === "gregory" || id === "iso8601") {
    return date.era === "BC" ? "short" : undefined
  }
  return "short"
}
