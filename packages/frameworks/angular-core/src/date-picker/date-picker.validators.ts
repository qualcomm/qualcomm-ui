// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AbstractControl, ValidationErrors} from "@angular/forms"

export function completeRangeValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value as unknown[] | null | undefined
  if (!Array.isArray(value) || value.length === 0) {
    return null
  }
  return value[0] != null && value[1] != null
    ? null
    : {required: {value: control.value}}
}
