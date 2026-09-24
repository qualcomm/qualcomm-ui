// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreDatePickerTableHeadDirective} from "@qualcomm-ui/angular-core/date-picker"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * The calendar grid header.
 */
@Directive({
  selector: "[q-date-picker-table-head]",
  standalone: false,
})
export class DatePickerTableHeadDirective extends CoreDatePickerTableHeadDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getTableHeadBindings()),
    )
  }
}
