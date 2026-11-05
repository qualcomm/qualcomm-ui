// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreDatePickerTableHeaderDirective} from "@qualcomm-ui/angular-core/date-picker"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * A column header in the calendar grid.
 */
@Directive({
  selector: "[q-date-picker-table-header]",
  standalone: false,
})
export class DatePickerTableHeaderDirective extends CoreDatePickerTableHeaderDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getTableHeaderBindings()),
    )
  }
}
