// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"

import {useInputErrorText} from "@qualcomm-ui/angular/input"
import type {LucideIcon} from "@qualcomm-ui/angular-core/lucide"
import {CoreSelectErrorTextDirective} from "@qualcomm-ui/angular-core/select"

@Component({
  selector: "[q-select-error-text]",
  standalone: false,
  template: `
    @if (icon()) {
      <svg [qIcon]="icon()!" />
    }
    <ng-content />
  `,
})
export class SelectErrorTextDirective extends CoreSelectErrorTextDirective {
  /**
   * Optional error indicator icon.
   */
  readonly icon = input<LucideIcon | string>()

  protected readonly errorTextContext = useInputErrorText()

  constructor() {
    super()
    this.trackBindings.extendWith(() => this.errorTextContext.getBindings())
  }
}
