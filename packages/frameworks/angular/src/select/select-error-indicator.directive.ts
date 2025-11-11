// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"
import {CircleAlert} from "lucide-angular"

import {useInputErrorIndicator} from "@qualcomm-ui/angular/input"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CoreSelectErrorIndicatorDirective} from "@qualcomm-ui/angular-core/select"

@Component({
  selector: "[q-select-error-indicator]",
  standalone: false,
  template: `
    <ng-content>
      <svg [qIcon]="icon()"></svg>
    </ng-content>
  `,
})
export class SelectErrorIndicatorDirective extends CoreSelectErrorIndicatorDirective {
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
