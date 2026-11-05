// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreDatePickerPresetTriggerDirective} from "@qualcomm-ui/angular-core/date-picker"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Selects a preset date or range.
 */
@Directive({
  selector: "[q-date-picker-preset-trigger]",
  standalone: false,
})
export class DatePickerPresetTriggerDirective extends CoreDatePickerPresetTriggerDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getPresetTriggerBindings()),
    )
  }
}
