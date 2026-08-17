// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"

import {CoreFileUploadErrorTextDirective} from "@qualcomm-ui/angular-core/file-upload"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useInputErrorText} from "@qualcomm-ui/angular/input"

@Component({
  selector: "[q-file-input-error-text]",
  standalone: false,
  template: `
    @if (icon()) {
      <svg [qIcon]="icon()!" />
    }
    <ng-content />
  `,
})
export class FileInputErrorTextDirective extends CoreFileUploadErrorTextDirective {
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
