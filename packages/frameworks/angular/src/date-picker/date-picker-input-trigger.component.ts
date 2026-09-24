// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {LucideCalendar} from "@lucide/angular"

import {CoreDatePickerTriggerDirective} from "@qualcomm-ui/angular-core/date-picker"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {useIconButtonApi} from "@qualcomm-ui/angular/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Calendar toggle styled as a compact icon button, used inside the input group.
 */
@Component({
  providers: [provideIcons({LucideCalendar})],
  selector: "[q-date-picker-input-trigger]",
  standalone: false,
  template: `
    <ng-content>
      <svg
        qIcon="LucideCalendar"
        [q-bind]="iconButtonApi().getIconBindings()"
      ></svg>
    </ng-content>
  `,
})
export class DatePickerInputTriggerDirective extends CoreDatePickerTriggerDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  protected readonly iconButtonApi = useIconButtonApi({
    density: "compact",
    disabled: computed(() => this.datePickerContext().disabled),
    size: computed(() => this.qdsContext().triggerSize),
    variant: "ghost",
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.qdsContext().getTriggerBindings(),
          this.iconButtonApi().getRootBindings(),
        ),
      ),
    )
  }
}
