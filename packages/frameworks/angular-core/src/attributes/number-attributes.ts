// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {numberAttribute} from "@angular/core"

/**
 * The `numberAttribute` transformer with a fallback to 0 if the input can't be
 * parsed as a number.
 */
export function numberAttributeOrZero(value: any) {
  return numberAttribute(value, 0)
}

/**
 * The `numberAttribute` transformer with a fallback to undefined if the input can't
 * be parsed as a number.
 */
export function numberAttributeOrUndefined(value: any) {
  const res = numberAttribute(value)
  if (Number.isNaN(res)) {
    return undefined
  }
  return res
}
