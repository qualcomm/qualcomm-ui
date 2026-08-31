// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CoreDatePickerClearTriggerDirective} from "@qualcomm-ui/angular-core/date-picker"

/**
 * A button that clears the selection.
 */
@Directive({
  selector: "[q-date-picker-clear-trigger]",
  standalone: false,
})
export class DatePickerClearTriggerDirective extends CoreDatePickerClearTriggerDirective {}
