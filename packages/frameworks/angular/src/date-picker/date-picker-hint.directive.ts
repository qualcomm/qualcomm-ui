// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreDatePickerHintDirective} from "@qualcomm-ui/angular-core/date-picker"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Helper text displayed below the field. Hidden while the date picker is
 * invalid.
 */
@Directive({
  selector: "[q-date-picker-hint]",
  standalone: false,
})
export class DatePickerHintDirective extends CoreDatePickerHintDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getHintBindings()),
    )
  }
}
