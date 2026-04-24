// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  input,
  type OnInit,
  signal,
} from "@angular/core"

import {
  END_ICON_CONTEXT_TOKEN,
  type IconTokenContext,
  START_ICON_CONTEXT_TOKEN,
} from "@qualcomm-ui/angular/icon"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  headerBarClasses,
  type QdsHeaderBarNavItemProps,
} from "@qualcomm-ui/qds-core/header-bar"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {useQdsHeaderBarContext} from "./qds-header-bar-context.service"

@Component({
  providers: [
    {
      provide: START_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => ({
        getBindings: signal({
          class: headerBarClasses.itemIcon,
          "data-header-bar-part": "start-icon",
        }),
      }),
    },
    {
      provide: END_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => ({
        getBindings: signal({
          class: headerBarClasses.itemIcon,
          "data-header-bar-part": "end-icon",
        }),
      }),
    },
  ],
  selector: "[q-header-bar-nav-item]",
  standalone: false,
  template: `
    <ng-content select="[q-start-icon]">
      @if (startIcon()) {
        <svg q-start-icon [qIcon]="startIcon()!"></svg>
      }
    </ng-content>

    <ng-content />

    <ng-content select="[q-end-icon]">
      @if (endIcon()) {
        <svg q-end-icon [qIcon]="endIcon()!"></svg>
      }
    </ng-content>
  `,
})
export class HeaderBarNavItemDirective
  implements OnInit, SignalifyInput<QdsHeaderBarNavItemProps>
{
  /**
   * Whether the nav item is the current active route.
   */
  readonly active = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Lucide icon rendered before the item label.
   */
  readonly startIcon = input<LucideIconOrString>()

  /**
   * Lucide icon rendered after the item label.
   */
  readonly endIcon = input<LucideIconOrString>()

  protected readonly qdsHeaderBarContext = useQdsHeaderBarContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsHeaderBarContext().getNavItemBindings({active: this.active()}),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
