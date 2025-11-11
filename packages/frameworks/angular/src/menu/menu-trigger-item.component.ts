// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {
  CoreMenuTriggerItemDirective,
  provideMenuItemContext,
} from "@qualcomm-ui/angular-core/menu"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Component({
  providers: [provideMenuItemContext()],
  selector: "[q-menu-trigger-item]",
  standalone: false,
  template: `
    <ng-content />
    <ng-content select="[q-menu-trigger-item-indicator]">
      <div q-menu-trigger-item-indicator></div>
    </ng-content>
  `,
})
export class MenuTriggerItemComponent extends CoreMenuTriggerItemDirective {
  readonly qdsMenuContext = useQdsMenuContext()

  readonly qdsBindings = computed(() => this.qdsMenuContext().getItemBindings())

  constructor() {
    super()
    this.trackBindings.extendWith(this.qdsBindings)
  }
}
