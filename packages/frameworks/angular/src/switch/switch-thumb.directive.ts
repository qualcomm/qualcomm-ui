// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreSwitchThumbDirective} from "@qualcomm-ui/angular-core/switch"

import {useQdsSwitchContext} from "./qds-switch-context.service"

@Directive({
  selector: "[q-switch-thumb]",
  standalone: false,
})
export class SwitchThumbDirective extends CoreSwitchThumbDirective {
  protected readonly qdsSwitchContext = useQdsSwitchContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSwitchContext().getThumbBindings()),
    )
  }
}
