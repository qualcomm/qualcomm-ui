// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {LucideChevronRight} from "@lucide/angular"

import {CoreDatePickerNextTriggerDirective} from "@qualcomm-ui/angular-core/date-picker"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {useIconButtonApi} from "@qualcomm-ui/angular/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Advances the calendar to the next page. Styled as a ghost icon button.
 */
@Component({
  providers: [provideIcons({LucideChevronRight})],
  selector: "[q-date-picker-next-trigger]",
  standalone: false,
  template: `
    <ng-content>
      <svg
        qIcon="LucideChevronRight"
        [q-bind]="iconButtonApi().getIconBindings()"
      ></svg>
    </ng-content>
  `,
})
export class DatePickerNextTriggerDirective extends CoreDatePickerNextTriggerDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  protected readonly iconButtonApi = useIconButtonApi({
    density: "compact",
    disabled: computed(() => !!this.coreBindings().disabled),
    size: "md",
    variant: "ghost",
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.qdsContext().getNextTriggerBindings(),
          this.iconButtonApi().getRootBindings(),
        ),
      ),
    )
  }
}
