// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input, type OnInit} from "@angular/core"

import {useDatePickerContext} from "@qualcomm-ui/angular-core/date-picker"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {getDatePickerHeadlineValueText} from "@qualcomm-ui/qds-core/date-picker"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Renders the current selection as human readable text.
 */
@Component({
  selector: "[q-date-picker-headline-value]",
  standalone: false,
  template: `
    {{ text() }}
  `,
})
export class DatePickerHeadlineValueDirective implements OnInit {
  /**
   * Format used to render the selected date(s).
   */
  readonly format = input<Intl.DateTimeFormatOptions | undefined>()

  /**
   * Suffix appended in `multiple` mode when more than two dates are selected.
   *
   * @default (count) => `+${count} more`
   */
  readonly moreLabel = input<((count: number) => string) | undefined>()

  /**
   * Text shown when no date is selected.
   *
   * @default 'Select date'
   */
  readonly placeholder = input<string | undefined>()

  /**
   * Placeholders for the start and end of an incomplete range.
   *
   * @default ['Start', 'End']
   */
  readonly rangePlaceholder = input<[string, string] | undefined>()

  protected readonly api = useDatePickerContext()
  protected readonly qdsContext = useQdsDatePickerContext()

  protected readonly text = computed(() => {
    const api = this.api()
    return getDatePickerHeadlineValueText({
      format: api.format,
      formatOptions: this.format(),
      moreLabel: this.moreLabel(),
      placeholder: this.placeholder(),
      rangePlaceholder: this.rangePlaceholder(),
      selectionMode: api.selectionMode,
      value: api.value,
    })
  })

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getHeadlineValueBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
