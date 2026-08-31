// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import {useDatePickerContext} from "@qualcomm-ui/angular-core/date-picker"
import type {DatePickerApiMonthGridProps} from "@qualcomm-ui/core/date-picker"
import {datePickerViewColumns} from "@qualcomm-ui/qds-core/date-picker"

import {DatePickerTableBodyDirective} from "./date-picker-table-body.directive"

/**
 * Renders the month cells for the month view. Apply to a `tbody` element.
 */
@Component({
  selector: "[q-date-picker-month-grid]",
  standalone: false,
  template: `
    @for (months of monthsGrid(); track $index) {
      <tr q-date-picker-table-row>
        @for (month of months; track month.value) {
          <td q-date-picker-table-cell [value]="month.value">
            <div q-date-picker-table-cell-trigger>{{ month.label }}</div>
          </td>
        }
      </tr>
    }
  `,
})
export class DatePickerMonthGridDirective extends DatePickerTableBodyDirective {
  /**
   * The format used to render the month labels.
   *
   * @default 'short'
   */
  readonly format =
    input<NonNullable<DatePickerApiMonthGridProps["format"]>>("short")

  protected readonly api = useDatePickerContext()

  protected readonly monthsGrid = computed(() =>
    this.api().getMonthsGrid({
      columns: datePickerViewColumns.month,
      format: this.format(),
    }),
  )
}
