// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

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
  type QdsDialogPlacement,
  type QdsDialogScrollBehavior,
  type QdsDialogSize,
} from "@qualcomm-ui/qds-core/dialog"

import {
  provideQdsDialogContext,
  QdsDialogContextService,
} from "./qds-dialog-context.service"

/**
 * The root component that provides context for the dialog and its parts.
 */
@Directive({
  providers: [
    provideDialogContext(),
    provideQdsDialogContext(),
    providePresenceContext(),
  ],
  selector: "[q-dialog-root]",
  standalone: false,
})
export class DialogRootDirective
  extends CoreDialogRootDirective
  implements SignalifyInput<QdsDialogApiProps>, OnInit
{
  /**
   * The style variant of the dialog's indicator.
   *
   * @default 'neutral'
   */
  readonly emphasis = input<QdsDialogEmphasis>()

  /**
   * The vertical placement of the dialog within the viewport.
   *
   * @option `'top'`: The dialog is positioned at the top of the viewport.
   * @option `'center'`: The dialog is positioned at the center of the viewport.
   * @option `'bottom'`: The dialog is positioned at the bottom of the viewport.
   *
   * @default 'top'
   */
  readonly placement = input<QdsDialogPlacement>()

  /**
   * Defines the scroll behavior of the dialog content when modal content exceeds
   * viewport height.
   *
   * @option `'inside'`: The modal and backdrop create an internal scroll area within the modal.
   * @option `'outside'`: The modal and backdrop move with the page scroll instead of creating an internal scroll area within the modal.
   *
   * @default 'outside'
   */
  readonly scrollBehavior = input<QdsDialogScrollBehavior>()

  /**
   * The size of the dialog's content area and fonts. A smaller size uses less
   * horizontal space.
   *
   * @default 'sm'
   */
  readonly size = input<QdsDialogSize>()

  protected readonly qdsDialogService = inject(QdsDialogContextService)

  override ngOnInit() {
    super.ngOnInit()

    this.qdsDialogService.init(
      computed(() =>
        createQdsDialogApi(
          {
            emphasis: this.emphasis(),
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
