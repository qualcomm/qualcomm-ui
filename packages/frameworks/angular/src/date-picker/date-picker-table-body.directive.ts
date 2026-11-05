// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreDatePickerTableBodyDirective} from "@qualcomm-ui/angular-core/date-picker"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * The calendar grid body.
 */
@Directive({
  selector: "[q-date-picker-table-body]",
  standalone: false,
})
export class DatePickerTableBodyDirective extends CoreDatePickerTableBodyDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getTableBodyBindings()),
    )
  }
}
