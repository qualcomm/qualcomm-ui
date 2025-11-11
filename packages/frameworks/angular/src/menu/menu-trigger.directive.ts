// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {CoreMenuTriggerDirective} from "@qualcomm-ui/angular-core/menu"

@Directive({
  selector: "[q-menu-trigger]",
  standalone: false,
})
export class MenuTriggerDirective extends CoreMenuTriggerDirective {
  protected override trackBindings = useTrackBindings(() => {
    const bindings = this.menuContext().getTriggerBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    })
    return {
      ...bindings,
      "aria-controls": this.presenceService.unmounted()
        ? undefined
        : bindings["aria-controls"],
    }
  })
}
