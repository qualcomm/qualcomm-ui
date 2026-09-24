// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreDatePickerErrorTextDirective} from "@qualcomm-ui/angular-core/date-picker"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Error message displayed when the date picker is invalid.
 */
@Directive({
  selector: "[q-date-picker-error-text]",
  standalone: false,
})
export class DatePickerErrorTextDirective extends CoreDatePickerErrorTextDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getErrorTextBindings()),
    )
  }
}
