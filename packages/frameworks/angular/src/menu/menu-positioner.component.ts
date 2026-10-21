// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {CoreMenuPositionerDirective} from "@qualcomm-ui/angular-core/menu"
import {QDS_BUTTON_PROPS_CONTEXT} from "@qualcomm-ui/angular/button"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Component({
  providers: [{provide: QDS_BUTTON_PROPS_CONTEXT, useValue: () => ({})}],
  selector: "[q-menu-positioner]",
  standalone: false,
  template: `
    @if (!presenceService.unmounted()) {
      <ng-content />
    }
  `,
})
export class MenuPositionerComponent extends CoreMenuPositionerDirective {
  protected readonly qdsMenuContext = useQdsMenuContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsMenuContext().getPositionerBindings()),
    )
  }
}
