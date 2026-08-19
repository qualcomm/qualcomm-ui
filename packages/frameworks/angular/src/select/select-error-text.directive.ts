// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CoreSelectErrorTextDirective} from "@qualcomm-ui/angular-core/select"
import {useInputErrorText} from "@qualcomm-ui/angular/input"

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
  readonly icon = input<LucideIconOrString>()

  protected readonly errorTextContext = useInputErrorText()

  constructor() {
    super()
    this.trackBindings.extendWith(() => this.errorTextContext.getBindings())
  }
}
