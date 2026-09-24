// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {
  CoreDatePickerTableDirective,
  provideDatePickerTableContext,
} from "@qualcomm-ui/angular-core/date-picker"
import {datePickerViewColumns} from "@qualcomm-ui/qds-core/date-picker"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * The calendar grid. The column count is fixed per view, so the `columns` input
 * of the core directive is ignored.
 */
@Directive({
  providers: [provideDatePickerTableContext()],
  selector: "[q-date-picker-table]",
  standalone: false,
})
export class DatePickerTableDirective extends CoreDatePickerTableDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  protected override readonly resolvedColumns = computed(() => {
    const view = this.resolvedView()
    return view ? datePickerViewColumns[view] : undefined
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => {
        const columns = this.resolvedColumns()
        return mergeProps(
          this.qdsContext().getTableBindings(),
          columns ? {style: {"--columns": columns}} : {},
        )
      }),
    )
  }
}
