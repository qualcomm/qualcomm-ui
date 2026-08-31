// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"
import {LucideCircleAlert} from "@lucide/angular"

import {CoreDatePickerErrorIndicatorDirective} from "@qualcomm-ui/angular-core/date-picker"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Visual indicator displayed inside the control when the date picker is
 * invalid.
 */
@Component({
  selector: "[q-date-picker-error-indicator]",
  standalone: false,
  template: `
    <ng-content>
      <svg [qIcon]="icon()"></svg>
    </ng-content>
  `,
})
export class DatePickerErrorIndicatorDirective extends CoreDatePickerErrorIndicatorDirective {
  /**
   * lucide icon
   *
   * @default LucideCircleAlert
   */
  readonly icon = input<LucideIconOrString>(LucideCircleAlert)

  protected readonly qdsContext = useQdsDatePickerContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getErrorIndicatorBindings()),
    )
  }
}
