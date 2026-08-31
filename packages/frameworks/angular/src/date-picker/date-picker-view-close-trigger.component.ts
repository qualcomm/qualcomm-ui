// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {LucideX} from "@lucide/angular"

import {CoreDatePickerViewCloseTriggerDirective} from "@qualcomm-ui/angular-core/date-picker"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {useIconButtonApi} from "@qualcomm-ui/angular/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Returns from the month or year view to the day calendar. Styled as an outline
 * icon button.
 */
@Component({
  providers: [provideIcons({LucideX})],
  selector: "[q-date-picker-view-close-trigger]",
  standalone: false,
  template: `
    <ng-content>
      <svg qIcon="LucideX" [q-bind]="iconButtonApi().getIconBindings()"></svg>
    </ng-content>
  `,
})
export class DatePickerViewCloseTriggerDirective extends CoreDatePickerViewCloseTriggerDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  protected readonly iconButtonApi = useIconButtonApi({
    density: "compact",
    disabled: computed(() => !!this.coreBindings().disabled),
    shape: "square",
    size: "sm",
    variant: "outline",
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.qdsContext().getViewCloseTriggerBindings(),
          this.iconButtonApi().getRootBindings(),
        ),
      ),
    )
  }
}
