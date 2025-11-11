// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {
  CoreMenuCheckboxItemDirective,
  provideMenuItemContext,
  provideMenuOptionItemContext,
} from "@qualcomm-ui/angular-core/menu"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Directive({
  providers: [provideMenuItemContext(), provideMenuOptionItemContext()],
  selector: "[q-menu-checkbox-item]",
  standalone: false,
})
export class MenuCheckboxItemDirective extends CoreMenuCheckboxItemDirective {
  protected readonly qdsMenuContext = useQdsMenuContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsMenuContext().getItemBindings()),
    )
  }
}
