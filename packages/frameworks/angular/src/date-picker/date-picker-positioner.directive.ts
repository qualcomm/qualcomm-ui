// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreDatePickerPositionerDirective} from "@qualcomm-ui/angular-core/date-picker"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Positions the calendar relative to the control.
 */
@Directive({
  selector: "[q-date-picker-positioner]",
  standalone: false,
})
export class DatePickerPositionerDirective extends CoreDatePickerPositionerDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getPositionerBindings()),
    )
  }
}
