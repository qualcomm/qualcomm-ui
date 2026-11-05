// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreDatePickerTableRowDirective} from "@qualcomm-ui/angular-core/date-picker"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * A row in the calendar grid.
 */
@Directive({
  selector: "[q-date-picker-table-row]",
  standalone: false,
})
export class DatePickerTableRowDirective extends CoreDatePickerTableRowDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getTableRowBindings()),
    )
  }
}
