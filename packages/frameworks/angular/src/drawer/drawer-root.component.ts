// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {
  provideQdsDialogContext,
  QdsDialogContextService,
} from "@qualcomm-ui/angular/dialog"
import {
  CoreDialogRootDirective,
  provideDialogContext,
} from "@qualcomm-ui/angular-core/dialog"
import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {providePresenceContext} from "@qualcomm-ui/angular-core/presence"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsDialogApi,
  type QdsDialogApiProps,
  type QdsDialogEmphasis,
  type QdsDialogScrollBehavior,
  type QdsDialogSize,
} from "@qualcomm-ui/qds-core/dialog"
import {
  createQdsDrawerApi,
  type QdsDrawerApiProps,
  type QdsDrawerPlacement,
} from "@qualcomm-ui/qds-core/drawer"

import {
  provideQdsDrawerContext,
  QdsDrawerContextService,
} from "./qds-drawer-context.service"

/**
 * The root component that provides context for the drawer and its parts.
 */
@Directive({
  providers: [
    provideDialogContext(),
    provideQdsDialogContext(),
    provideQdsDrawerContext(),
    providePresenceContext(),
  ],
  selector: "[q-drawer-root]",
  standalone: false,
})
export class DrawerRootDirective
  extends CoreDialogRootDirective
  implements
    SignalifyInput<Omit<QdsDialogApiProps, "placement">>,
    SignalifyInput<QdsDrawerApiProps>,
    OnInit
{
  /**
   * The style variant of the drawer's indicator.
   *
   * @default 'neutral'
   */
  readonly emphasis = input<QdsDialogEmphasis>()

  /**
   * The horizontal placement of the drawer within the viewport.
   *
   * @default 'end'
   */
  readonly placement = input<QdsDrawerPlacement>()

  /**
   * Defines the scroll behavior of the drawer content when modal content exceeds
   * viewport height.
   *
   * @option `'inside'`: The modal and backdrop create an internal scroll area within the modal.
   * @option `'outside'`: The modal and backdrop move with the page scroll instead of creating an internal scroll area within the modal.
   *
   * @default 'outside'
   */
  readonly scrollBehavior = input<QdsDialogScrollBehavior>()

  /**
   * The size of the drawer's content area and fonts. A smaller size uses less
   * horizontal space.
   *
   * @default 'sm'
   */
  readonly size = input<QdsDialogSize>()

  protected readonly qdsDialogService = inject(QdsDialogContextService)
  protected readonly qdsDrawerService = inject(QdsDrawerContextService)

  override ngOnInit() {
    super.ngOnInit()

    this.qdsDialogService.init(
      computed(() =>
        createQdsDialogApi(
          {
            emphasis: this.emphasis(),
            // this is ignored for the drawer
            placement: "top",
            scrollBehavior: this.scrollBehavior(),
            size: this.size(),
          },
          normalizeProps,
        ),
      ),
    )

    this.qdsDrawerService.init(
      computed(() =>
        createQdsDrawerApi(
          {
            placement: this.placement(),
            scrollBehavior: this.scrollBehavior(),
            size: this.size(),
          },
          normalizeProps,
        ),
      ),
    )
  }
}
