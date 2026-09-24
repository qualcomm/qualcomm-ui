// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, Component, computed, input} from "@angular/core"

import {CoreDatePickerViewTriggerDirective} from "@qualcomm-ui/angular-core/date-picker"
import {useButtonApi} from "@qualcomm-ui/angular/button"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Switches to the next view level (day to month to year). Styled as a ghost
 * button.
 */
@Component({
  selector: "[q-date-picker-view-trigger]",
  standalone: false,
  template: `
    <ng-content />
  `,
})
export class DatePickerViewTriggerDirective extends CoreDatePickerViewTriggerDirective {
  /**
   * Renders the trigger as a non-interactive label. Use in the month and year
   * views, where the label describes the visible range rather than a target.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  protected readonly qdsContext = useQdsDatePickerContext()

  protected readonly buttonApi = useButtonApi({
    density: "compact",
    disabled: computed(() => this.disabled() || !!this.coreBindings().disabled),
    size: "md",
    variant: "ghost",
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.qdsContext().getViewTriggerBindings(),
          this.buttonApi().getRootBindings(),
        ),
      ),
    )
  }
}
