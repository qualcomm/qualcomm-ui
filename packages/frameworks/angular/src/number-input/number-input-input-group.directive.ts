// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {useInputGroup} from "@qualcomm-ui/angular/input"
import {CoreNumberInputInputGroupDirective} from "@qualcomm-ui/angular-core/number-input"

import {useQdsNumberInputContext} from "./qds-number-input-context.service"

@Component({
  selector: "[q-number-input-input-group]",
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
export class NumberInputInputGroupDirective extends CoreNumberInputInputGroupDirective {
  protected readonly qdsNumberInputContext = useQdsNumberInputContext()

  protected inputGroupContext = useInputGroup()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsNumberInputContext().getInputGroupBindings()),
    )
  }
}
