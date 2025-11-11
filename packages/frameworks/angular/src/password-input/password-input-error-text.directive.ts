// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, inject, input} from "@angular/core"

import {useInputErrorText} from "@qualcomm-ui/angular/input"
import {INPUT_FORM_CONTROL_CONTEXT} from "@qualcomm-ui/angular-core/input"
import type {LucideIcon} from "@qualcomm-ui/angular-core/lucide"
import {CorePasswordInputErrorTextDirective} from "@qualcomm-ui/angular-core/password-input"

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
  readonly icon = input<LucideIcon | string>()

  protected readonly errorTextContext = useInputErrorText()

  protected readonly formControlContext = inject(INPUT_FORM_CONTROL_CONTEXT)

  constructor() {
    super()
    this.trackBindings.extendWith(() => this.errorTextContext.getBindings())
  }
}
