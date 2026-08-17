// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"

import {CoreComboboxErrorTextDirective} from "@qualcomm-ui/angular-core/combobox"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useInputErrorText} from "@qualcomm-ui/angular/input"

@Component({
  selector: "[q-combobox-error-text]",
  standalone: false,
  template: `
    @if (icon()) {
      <svg [qIcon]="icon()!" />
    }
    <ng-content />
  `,
})
export class ComboboxErrorTextDirective extends CoreComboboxErrorTextDirective {
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
