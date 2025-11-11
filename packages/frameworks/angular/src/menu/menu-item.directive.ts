// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, type OnInit} from "@angular/core"

import {
  CoreMenuItemRootDirective,
  provideMenuItemContext,
} from "@qualcomm-ui/angular-core/menu"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Directive({
  providers: [provideMenuItemContext()],
  selector: "[q-menu-item]",
  standalone: false,
})
export class MenuItemDirective
  extends CoreMenuItemRootDirective
  implements OnInit
{
  protected readonly qdsMenuContext = useQdsMenuContext()

  override ngOnInit() {
    this.trackBindings({
      extraBindings: computed(() => this.qdsMenuContext().getItemBindings()),
    })
  }
}
