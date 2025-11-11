// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component} from "@angular/core"

import {useInputGroup} from "@qualcomm-ui/angular/input"
import {CoreTextInputInputGroupDirective} from "@qualcomm-ui/angular-core/text-input"

/**
 * Container that wraps the input element and optional icons.
 */
@Component({
  selector: "[q-text-input-input-group]",
  standalone: false,
  template: `
    <ng-content select="[q-input-start-icon]">
      @if (inputGroupContext().startIcon) {
        <div q-input-start-icon [icon]="inputGroupContext().startIcon"></div>
      }
    </ng-content>
    <ng-content />
    <ng-content select="[q-input-end-icon]">
      @if (inputGroupContext().endIcon) {
        <div q-input-end-icon [icon]="inputGroupContext().endIcon"></div>
      }
    </ng-content>
  `,
})
export class TextInputInputGroupDirective extends CoreTextInputInputGroupDirective {
  protected readonly inputGroupContext = useInputGroup()

  constructor() {
    super()
    this.trackBindings.extendWith(() => this.inputGroupContext().getBindings())
  }
}
