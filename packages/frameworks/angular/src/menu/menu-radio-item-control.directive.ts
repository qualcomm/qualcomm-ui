// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreMenuOptionItemControlDirective} from "@qualcomm-ui/angular-core/menu"

import {useQdsMenuContext} from "./qds-menu-context.service"

/**
 * Visual control rendered within a radio menu item. Place custom content
 * (e.g. an indicator SVG) as a child.
 */
@Directive({
  selector: "[q-menu-radio-item-control]",
  standalone: false,
})
export class MenuRadioItemControlDirective extends CoreMenuOptionItemControlDirective {
  protected readonly qdsMenuContext = useQdsMenuContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsMenuContext().getRadioItemControlBindings()),
    )
  }
}
