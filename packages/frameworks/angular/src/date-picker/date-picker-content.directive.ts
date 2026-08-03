// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreDatePickerContentDirective} from "@qualcomm-ui/angular-core/date-picker"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Container for the calendar.
 */
@Directive({
  selector: "[q-date-picker-content]",
  standalone: false,
})
export class DatePickerContentDirective extends CoreDatePickerContentDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getContentBindings()),
    )
  }
}
