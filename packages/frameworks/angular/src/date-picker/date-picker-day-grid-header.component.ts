// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import {useDatePickerContext} from "@qualcomm-ui/angular-core/date-picker"
import type {DatePickerWeekDay} from "@qualcomm-ui/core/date-picker"

import {DatePickerTableHeadDirective} from "./date-picker-table-head.directive"

export type DatePickerWeekDayFormat = Extract<
  keyof DatePickerWeekDay,
  "long" | "narrow" | "short"
>

/**
 * Renders the weekday column headers for the day view. Apply to a `thead`
 * element.
 */
@Component({
  selector: "[q-date-picker-day-grid-header]",
  standalone: false,
  template: `
    <tr q-date-picker-table-row>
      @for (weekDay of weekDays(); track $index) {
        <th
          q-date-picker-table-header
          scope="col"
          [attr.aria-label]="weekDay.long"
        >
          {{ weekDay[format()] }}
        </th>
      }
    </tr>
  `,
})
export class DatePickerDayGridHeaderDirective extends DatePickerTableHeadDirective {
  /**
   * The format used to render the weekday labels.
   *
   * @default 'narrow'
   */
  readonly format = input<DatePickerWeekDayFormat>("narrow")

  protected readonly api = useDatePickerContext()
  protected readonly weekDays = computed(() => this.api().weekDays)
}
