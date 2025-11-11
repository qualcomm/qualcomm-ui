// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {CoreNumberInputControlDirective} from "@qualcomm-ui/angular-core/number-input"

import {useQdsNumberInputContext} from "./qds-number-input-context.service"

/**
 * @remarks
 * This component is a shortcut for the following:
 * ```angular-html
 * <ng-content select="[q-number-input-decrement-trigger]">
 *   <button q-number-input-decrement-trigger></button>
 * </ng-content>
 * <ng-content select="[q-number-input-increment-trigger]">
 *   <button q-number-input-increment-trigger></button>
 * </ng-content>
 * ```
 */
@Component({
  selector: "[q-number-input-control]",
  standalone: false,
  template: `
    <ng-content select="[q-number-input-decrement-trigger]">
      <button q-number-input-decrement-trigger></button>
    </ng-content>

    <ng-content select="[q-number-input-increment-trigger]">
      <button q-number-input-increment-trigger></button>
    </ng-content>
  `,
})
export class NumberInputControlDirective extends CoreNumberInputControlDirective {
  protected readonly qdsNumberInputContext = useQdsNumberInputContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsNumberInputContext().getControlBindings()),
    )
  }
}
