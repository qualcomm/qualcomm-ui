// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {CoreMenuOptionItemControlDirective} from "@qualcomm-ui/angular-core/menu"

import {useQdsMenuContext} from "./qds-menu-context.service"

/**
 * Visual control rendered within a checkbox menu item. Defaults to a checkmark
 * icon; project custom content to override.
 */
@Component({
  selector: "[q-menu-checkbox-item-control]",
  standalone: false,
  template: `
    <ng-content>
      <q-checkmark-icon [indeterminate]="false" />
    </ng-content>
  `,
})
export class MenuCheckboxItemControlComponent extends CoreMenuOptionItemControlDirective {
  protected readonly qdsMenuContext = useQdsMenuContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsMenuContext().getCheckboxItemControlBindings()),
    )
  }
}
