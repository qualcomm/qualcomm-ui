// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreDatePickerTableCellTriggerDirective} from "@qualcomm-ui/angular-core/date-picker"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * The selectable trigger inside a calendar cell.
 */
@Directive({
  selector: "[q-date-picker-table-cell-trigger]",
  standalone: false,
})
export class DatePickerTableCellTriggerDirective extends CoreDatePickerTableCellTriggerDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getTableCellTriggerBindings()),
    )
  }
}
