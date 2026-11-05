// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {useDatePickerContext} from "@qualcomm-ui/angular-core/date-picker"
import {datePickerViewColumns} from "@qualcomm-ui/qds-core/date-picker"

import {DatePickerTableBodyDirective} from "./date-picker-table-body.directive"

/**
 * Renders the year cells for the year view. Apply to a `tbody` element.
 */
@Component({
  selector: "[q-date-picker-year-grid]",
  standalone: false,
  template: `
    @for (years of yearsGrid(); track $index) {
      <tr q-date-picker-table-row>
        @for (year of years; track year.value) {
          <td q-date-picker-table-cell [value]="year.value">
            <div q-date-picker-table-cell-trigger>{{ year.label }}</div>
          </td>
        }
      </tr>
    }
  `,
})
export class DatePickerYearGridDirective extends DatePickerTableBodyDirective {
  protected readonly api = useDatePickerContext()

  protected readonly yearsGrid = computed(() =>
    this.api().getYearsGrid({columns: datePickerViewColumns.year}),
  )
}
