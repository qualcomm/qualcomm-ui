// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {CoreDatePickerRangeTextDirective} from "@qualcomm-ui/angular-core/date-picker"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Human readable text for the visible range. The text is view-aware (month and
 * year for the day view, the year for the month view, and the decade for the
 * year view).
 */
@Component({
  selector: "[q-date-picker-range-text]",
  standalone: false,
  template: `
    {{ datePickerContext().visibleRangeText.formatted }}
  `,
})
export class DatePickerRangeTextDirective extends CoreDatePickerRangeTextDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getRangeTextBindings()),
    )
  }
}
