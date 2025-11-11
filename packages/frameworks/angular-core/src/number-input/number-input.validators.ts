// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AbstractControl, ValidationErrors} from "@angular/forms"

/**
 * Validator that requires a number value. Will fail if the value is `NaN`, `null`,
 * or `undefined`.
 */
export function requiredNumberValidator(
  control: AbstractControl,
): ValidationErrors | null {
  if (
    Number.isNaN(control.value) ||
    control.value === null ||
    control.value === undefined
  ) {
    return {required: {value: control.value}}
  }
  return null
}
