// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreDatePickerViewControlDirective} from "@qualcomm-ui/angular-core/date-picker"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Groups the navigation controls of a view.
 */
@Directive({
  selector: "[q-date-picker-view-control]",
  standalone: false,
})
export class DatePickerViewControlDirective extends CoreDatePickerViewControlDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getViewControlBindings()),
    )
  }
}
