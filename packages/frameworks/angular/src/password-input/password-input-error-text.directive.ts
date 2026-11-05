// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, inject, input} from "@angular/core"

import {INPUT_FORM_CONTROL_CONTEXT} from "@qualcomm-ui/angular-core/input"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CorePasswordInputErrorTextDirective} from "@qualcomm-ui/angular-core/password-input"
import {useInputErrorText} from "@qualcomm-ui/angular/input"

@Component({
  selector: "[q-password-input-error-text]",
  standalone: false,
  template: `
    @if (icon()) {
      <svg [qIcon]="icon()!" />
    }
    <ng-content>
      @if (formControlContext.errorText()) {
        {{ formControlContext.errorText() }}
      }
    </ng-content>
  `,
})
export class PasswordInputErrorTextDirective extends CorePasswordInputErrorTextDirective {
  /**
   * Optional error indicator icon.
   */
  readonly icon = input<LucideIconOrString>()

  protected readonly errorTextContext = useInputErrorText()

  protected readonly formControlContext = inject(INPUT_FORM_CONTROL_CONTEXT)

  constructor() {
    super()
    this.trackBindings.extendWith(() => this.errorTextContext.getBindings())
  }
}
