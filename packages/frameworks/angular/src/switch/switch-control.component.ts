// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {CoreSwitchControlDirective} from "@qualcomm-ui/angular-core/switch"

import {useQdsSwitchContext} from "./qds-switch-context.service"

@Component({
  selector: "[q-switch-control]",
  standalone: false,
  template: `
    <ng-content>
      <span q-switch-thumb></span>
    </ng-content>
  `,
})
export class SwitchControlComponent extends CoreSwitchControlDirective {
  protected readonly qdsSwitchContext = useQdsSwitchContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSwitchContext().getControlBindings()),
    )
  }
}
