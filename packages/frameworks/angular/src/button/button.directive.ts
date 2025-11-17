// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, inject, input, type OnInit} from "@angular/core"

import {
  END_ICON_CONTEXT_TOKEN,
  type IconTokenContext,
  START_ICON_CONTEXT_TOKEN,
} from "@qualcomm-ui/angular/icon"
import {QuiPreloadDirective} from "@qualcomm-ui/angular/transitions"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"

import {BaseButtonDirective} from "./base-button.directive"
import {provideQdsButtonContext} from "./qds-button-context.service"

@Component({
  hostDirectives: [QuiPreloadDirective],
  providers: [
    provideQdsButtonContext(),
    {
      provide: START_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const button = inject(ButtonDirective)
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
        const button = inject(ButtonDirective)
        return {
          getBindings: computed(() =>
            button.buttonService.context().getEndIconBindings(),
          ),
        }
      },
    },
  ],
  selector: "[q-button]",
  standalone: false,
  template: `
    <ng-content select="[q-start-icon]">
      @if (startIcon()) {
        <svg q-start-icon [icon]="startIcon()!"></svg>
      }
    </ng-content>

    <ng-content />

    <ng-content select="[q-end-icon]">
      @if (endIcon()) {
        <svg q-end-icon [icon]="endIcon()!"></svg>
      }
    </ng-content>
  `,
})
export class ButtonDirective extends BaseButtonDirective implements OnInit {
  /**
   * {@link https://lucide.dev/icons lucide-angular} icon, positioned after the label.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <svg q-end-icon icon="..."></svg>
   * ```
   */
  readonly endIcon = input<LucideIconOrString>()
}
