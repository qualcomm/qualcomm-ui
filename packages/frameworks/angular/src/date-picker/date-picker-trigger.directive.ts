// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CoreDatePickerTriggerDirective} from "@qualcomm-ui/angular-core/date-picker"

/**
 * A button that opens and closes the calendar. Registers the trigger with the
 * date picker so accessibility and focus restoration work.
 */
@Directive({
  selector: "[q-date-picker-trigger]",
  standalone: false,
})
export class DatePickerTriggerDirective extends CoreDatePickerTriggerDirective {}
