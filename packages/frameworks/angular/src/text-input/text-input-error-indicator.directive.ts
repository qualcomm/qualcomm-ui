// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"
import {LucideCircleAlert} from "@lucide/angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CoreTextInputErrorIndicatorDirective} from "@qualcomm-ui/angular-core/text-input"
import {useInputErrorIndicator} from "@qualcomm-ui/angular/input"

/**
 * Visual indicator displayed when the input is invalid.
 */
@Component({
  selector: "[q-text-input-error-indicator]",
  standalone: false,
  template: `
    <ng-content>
      <svg [qIcon]="icon()!"></svg>
    </ng-content>
  `,
})
export class TextInputErrorIndicatorDirective extends CoreTextInputErrorIndicatorDirective {
  /**
   * `@lucide/angular` icon
   *
   * @default LucideCircleAlert
   */
  readonly icon = input<LucideIconOrString>(LucideCircleAlert)

  protected readonly inputErrorIndicatorContext = useInputErrorIndicator()

  constructor() {
    super()
    this.trackBindings.extendWith(() =>
      this.inputErrorIndicatorContext.getBindings(),
    )
  }
}
