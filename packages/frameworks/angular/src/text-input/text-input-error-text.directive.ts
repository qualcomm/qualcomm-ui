// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CoreTextInputErrorTextDirective} from "@qualcomm-ui/angular-core/text-input"
import {useInputErrorText} from "@qualcomm-ui/angular/input"

/**
 * Error message displayed when the input is invalid.
 */
@Component({
  selector: "[q-text-input-error-text]",
  standalone: false,
  template: `
    @if (icon()) {
      <svg [qIcon]="icon()!" />
    }
    <ng-content />
  `,
})
export class TextInputErrorTextDirective extends CoreTextInputErrorTextDirective {
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
