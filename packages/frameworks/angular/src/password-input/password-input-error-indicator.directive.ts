// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"
import {CircleAlert} from "lucide-angular"

import {useInputErrorIndicator} from "@qualcomm-ui/angular/input"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CorePasswordInputErrorIndicatorDirective} from "@qualcomm-ui/angular-core/password-input"

@Component({
  selector: "[q-password-input-error-indicator]",
  standalone: false,
  template: `
    <ng-content>
      <svg [qIcon]="icon()"></svg>
    </ng-content>
  `,
})
export class PasswordInputErrorIndicatorDirective extends CorePasswordInputErrorIndicatorDirective {
  /**
   * lucide-angular icon
   *
   * @default CircleAlert
   */
  readonly icon = input<LucideIconOrString>(CircleAlert)

  protected readonly inputErrorIndicatorContext = useInputErrorIndicator()

  constructor() {
    super()
    this.trackBindings.extendWith(() =>
      this.inputErrorIndicatorContext.getBindings(),
    )
  }
}
