// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {LucideEllipsisVertical, LucideX} from "@lucide/angular"

import {CoreDatePickerPresetsTriggerDirective} from "@qualcomm-ui/angular-core/date-picker"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {useIconButtonApi} from "@qualcomm-ui/angular/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Toggles the presets panel. Styled as an outline icon button that becomes a
 * close affordance while the panel is open.
 */
@Component({
  providers: [provideIcons({LucideEllipsisVertical, LucideX})],
  selector: "[q-date-picker-presets-trigger]",
  standalone: false,
  template: `
    <ng-content>
      @if (presetsOpen()) {
        <svg qIcon="LucideX" [q-bind]="iconButtonApi().getIconBindings()"></svg>
      } @else {
        <svg
          qIcon="LucideEllipsisVertical"
          [q-bind]="iconButtonApi().getIconBindings()"
        ></svg>
      }
    </ng-content>
  `,
})
export class DatePickerPresetsTriggerDirective extends CoreDatePickerPresetsTriggerDirective {
  protected readonly qdsContext = useQdsDatePickerContext()

  protected readonly presetsOpen = computed(
    () => this.datePickerContext().presetsOpen,
  )

  protected readonly iconButtonApi = useIconButtonApi({
    density: "compact",
    disabled: computed(() => !!this.coreBindings().disabled),
    emphasis: computed(() => (this.presetsOpen() ? "neutral" : "primary")),
    shape: computed(() => (this.presetsOpen() ? "square" : "rounded")),
    size: "sm",
    variant: "outline",
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.qdsContext().getPresetsTriggerBindings(),
          this.iconButtonApi().getRootBindings(),
        ),
      ),
    )
  }
}
