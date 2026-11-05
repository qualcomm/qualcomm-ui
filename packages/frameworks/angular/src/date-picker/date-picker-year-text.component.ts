// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import {useDatePickerContext} from "@qualcomm-ui/angular-core/date-picker"

export type DatePickerYearTextFormat = "2-digit" | "numeric"

/**
 * Renders the currently visible year. Intended as the label for a view trigger
 * that jumps to the year view.
 */
@Component({
  selector: "q-date-picker-year-text",
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
export class DatePickerYearTextDirective {
  /**
   * The format used to render the visible year.
   *
   * @default 'numeric'
   */
  readonly format = input<DatePickerYearTextFormat>("numeric")

  protected readonly api = useDatePickerContext()

  protected readonly text = computed(() => {
    const api = this.api()
    return api.format(api.visibleRange.start, {year: this.format()})
  })
}
