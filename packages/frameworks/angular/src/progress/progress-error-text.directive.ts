// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"
import {LucideCircleAlert} from "@lucide/angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CoreProgressErrorTextDirective} from "@qualcomm-ui/angular-core/progress"

import {useQdsProgressContext} from "./qds-progress-context.service"

@Component({
  selector: "[q-progress-error-text]",
  standalone: false,
  template: `
    <ng-content select="[qIcon]">
      @if (icon()) {
        <svg [qIcon]="icon()!" />
      }
    </ng-content>
    <ng-content />
  `,
})
export class ProgressErrorTextDirective extends CoreProgressErrorTextDirective {
  /**
   * Error indicator icon.
   *
   * @default LucideCircleAlert
   */
  readonly icon = input<LucideIconOrString>(LucideCircleAlert)

  protected readonly qdsContext = useQdsProgressContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getErrorTextBindings()),
    )
  }
}
