// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {ChevronDown} from "lucide-angular"

import {
  IconButtonDirective,
  provideQdsIconButtonContext,
} from "@qualcomm-ui/angular/button"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreMenuTriggerDirective} from "@qualcomm-ui/angular-core/menu"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Component({
  hostDirectives: [{directive: CoreMenuTriggerDirective, inputs: ["id"]}],
  providers: [provideIcons({ChevronDown}), provideQdsIconButtonContext()],
  selector: "button[q-menu-icon-button]",
  standalone: false,
  template: `
    <ng-content select="svg[qIcon]" />
    @if (icon()) {
      <svg [q-bind]="iconProps()" [qIcon]="icon()!"></svg>
    }
    <svg
      qIcon="ChevronDown"
      [q-bind]="indicatorBindings()"
      [size]="size()"
    ></svg>
  `,
})
export class MenuIconButtonComponent extends IconButtonDirective {
  protected readonly qdsMenuContext = useQdsMenuContext()

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
