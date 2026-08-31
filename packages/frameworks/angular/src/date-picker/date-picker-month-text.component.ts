// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import {useDatePickerContext} from "@qualcomm-ui/angular-core/date-picker"

export type DatePickerMonthTextFormat =
  | "2-digit"
  | "long"
  | "narrow"
  | "numeric"
  | "short"

/**
 * Renders the name of the currently visible month. Intended as the label for a
 * view trigger that jumps to the month view.
 */
@Component({
  selector: "q-date-picker-month-text",
  standalone: false,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    {{ text() }}
  `,
})
export class DatePickerMonthTextDirective {
  /**
   * The format used to render the visible month.
   *
   * @default 'long'
   */
  readonly format = input<DatePickerMonthTextFormat>("long")

  protected readonly api = useDatePickerContext()

  protected readonly text = computed(() => {
    const api = this.api()
    return api.format(api.visibleRange.start, {month: this.format()})
  })
}
