// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {
  CoreMenuItemGroupDirective,
  provideMenuItemGroupContext,
} from "@qualcomm-ui/angular-core/menu"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Directive({
  providers: [provideMenuItemGroupContext()],
  selector: "[q-menu-item-group]",
  standalone: false,
})
export class MenuItemGroupDirective extends CoreMenuItemGroupDirective {
  readonly qdsMenuContext = useQdsMenuContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsMenuContext().getItemGroupBindings()),
    )
  }
}
