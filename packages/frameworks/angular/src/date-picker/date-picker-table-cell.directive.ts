// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {
  CoreDatePickerTableCellDirective,
  provideDatePickerTableCellContext,
} from "@qualcomm-ui/angular-core/date-picker"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * A single cell in the calendar grid.
 */
@Directive({
  providers: [provideDatePickerTableCellContext()],
  selector: "[q-date-picker-table-cell]",
  standalone: false,
})
export class DatePickerTableCellDirective extends CoreDatePickerTableCellDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getTableCellBindings()),
    )
  }
}
