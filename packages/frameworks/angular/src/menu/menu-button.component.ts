// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, inject} from "@angular/core"
import {ChevronDown} from "lucide-angular"

import {
  BaseButtonDirective,
  provideQdsButtonContext,
} from "@qualcomm-ui/angular/button"
import {
  END_ICON_CONTEXT_TOKEN,
  type IconTokenContext,
  START_ICON_CONTEXT_TOKEN,
} from "@qualcomm-ui/angular/icon"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreMenuTriggerDirective} from "@qualcomm-ui/angular-core/menu"

import {useQdsMenuContext} from "./qds-menu-context.service"

@Component({
  hostDirectives: [{directive: CoreMenuTriggerDirective, inputs: ["id"]}],

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
    {
      provide: END_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const button = inject(MenuButtonComponent)
        return {
          getBindings: computed(() =>
            button.buttonService.context().getEndIconBindings(),
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

    <ng-content select="[q-end-icon]">
      <svg q-end-icon qIcon="ChevronDown" [size]="size()"></svg>
    </ng-content>
  `,
})
export class MenuButtonComponent extends BaseButtonDirective {
  protected qdsMenuContext = useQdsMenuContext()
  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsMenuContext().getButtonBindings()),
    )
  }
}
