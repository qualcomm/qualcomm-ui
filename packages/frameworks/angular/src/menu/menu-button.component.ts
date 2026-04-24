// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, inject} from "@angular/core"
import {ChevronDown} from "lucide-angular"

import {
  BaseButtonDirective,
  provideQdsButtonContext,
} from "@qualcomm-ui/angular/button"
import {
  type IconTokenContext,
  START_ICON_CONTEXT_TOKEN,
} from "@qualcomm-ui/angular/icon"
import {QuiPreloadDirective} from "@qualcomm-ui/angular/transitions"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreMenuTriggerDirective} from "@qualcomm-ui/angular-core/menu"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Component({
  hostDirectives: [
    {directive: CoreMenuTriggerDirective, inputs: ["id"]},
    QuiPreloadDirective,
  ],
  providers: [
    provideIcons({ChevronDown}),
    provideQdsButtonContext(),
    {
      provide: START_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const button = inject(MenuButtonComponent)
        return {
          getBindings: computed(() =>
            button.buttonService.context().getStartIconBindings(),
          ),
        }
      },
    },
  ],
  selector: "[q-menu-button]",
  standalone: false,
  template: `
    <ng-content select="[q-start-icon]" />
    @if (startIcon()) {
      <svg q-start-icon [qIcon]="startIcon()!" [size]="size()"></svg>
    }
    <ng-content />
    <svg
      qIcon="ChevronDown"
      [q-bind]="indicatorBindings()"
      [size]="size()"
    ></svg>
  `,
})
export class MenuButtonComponent extends BaseButtonDirective {
  protected qdsMenuContext = useQdsMenuContext()

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
