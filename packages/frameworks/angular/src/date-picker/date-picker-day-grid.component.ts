// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {useDatePickerContext} from "@qualcomm-ui/angular-core/date-picker"

import {DatePickerTableBodyDirective} from "./date-picker-table-body.directive"

/**
 * Renders the day cells for the visible month. Apply to a `tbody` element.
 */
@Component({
  selector: "[q-date-picker-day-grid]",
  standalone: false,
  template: `
    @for (week of weeks(); track $index) {
      <tr q-date-picker-table-row>
        @for (day of week; track day.toString()) {
          <td
            q-date-picker-table-cell
            [value]="day"
            [visibleRange]="visibleRange()"
          >
            <div q-date-picker-table-cell-trigger>{{ day.day }}</div>
          </td>
        }
      </tr>
    }
  `,
})
export class DatePickerDayGridDirective extends DatePickerTableBodyDirective {
  protected readonly api = useDatePickerContext()

  protected readonly visibleRange = computed(() => this.api().visibleRange)
  protected readonly weeks = computed(() => this.api().weeks)
}
