// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"
import {LucideCircleAlert} from "@lucide/angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CoreNumberInputErrorIndicatorDirective} from "@qualcomm-ui/angular-core/number-input"
import {useInputErrorIndicator} from "@qualcomm-ui/angular/input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsNumberInputContext} from "./qds-number-input-context.service"

@Component({
  selector: "[q-number-input-error-indicator]",
  standalone: false,
  template: `
    <ng-content>
      <svg [qIcon]="icon()!"></svg>
    </ng-content>
  `,
})
export class NumberInputErrorIndicatorDirective extends CoreNumberInputErrorIndicatorDirective {
  /**
   * `@lucide/angular` icon
   *
   * @default LucideCircleAlert
   */
  readonly icon = input<LucideIconOrString>(LucideCircleAlert)

  readonly qdsNumberInputContext = useQdsNumberInputContext()
  readonly inputErrorIndicatorContext = useInputErrorIndicator()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => {
        return mergeProps(
          this.inputErrorIndicatorContext.getBindings(),
          this.qdsNumberInputContext().getErrorIndicatorBindings(),
        )
      }),
    )
  }
}
