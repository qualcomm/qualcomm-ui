// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {LucideChevronDown} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreMenuTriggerDirective} from "@qualcomm-ui/angular-core/menu"
import {
  IconButtonDirective,
  provideQdsIconButtonContext,
} from "@qualcomm-ui/angular/button"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Component({
  hostDirectives: [{directive: CoreMenuTriggerDirective, inputs: ["id"]}],
  providers: [provideIcons({LucideChevronDown}), provideQdsIconButtonContext()],
  selector: "button[q-menu-icon-button]",
  standalone: false,
  template: `
    <ng-content select="svg[qIcon]" />
    @if (icon()) {
      <svg
        [q-bind]="iconProps()"
        [qIcon]="icon()!"
        [size]="resolvedSize()"
      ></svg>
    }
    <svg
      qIcon="LucideChevronDown"
      [q-bind]="indicatorBindings()"
      [size]="resolvedSize()"
    ></svg>
  `,
})
export class MenuIconButtonComponent extends IconButtonDirective {
  protected readonly qdsMenuContext = useQdsMenuContext()

  protected override readonly resolvedSize = computed(
    () =>
      this.buttonGroupContext?.()?.size ??
      this.size() ??
      this.qdsMenuContext().size,
  )

  readonly indicatorBindings = computed(() =>
    this.qdsMenuContext().getIndicatorBindings(),
  )

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsMenuContext().getButtonBindings()),
    )
  }
}
