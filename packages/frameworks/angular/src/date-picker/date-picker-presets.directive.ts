// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreDatePickerPresetsDirective} from "@qualcomm-ui/angular-core/date-picker"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Panel that lists {@link DatePickerPresetTriggerDirective} options in place of
 * the calendar while the {@link DatePickerPresetsTriggerDirective} is toggled
 * on.
 */
@Directive({
  selector: "[q-date-picker-presets]",
  standalone: false,
})
export class DatePickerPresetsDirective extends CoreDatePickerPresetsDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getPresetsBindings()),
    )
  }
}
