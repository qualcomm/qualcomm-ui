// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  CoreProgressRootDirective,
  provideProgressContext,
} from "@qualcomm-ui/angular-core/progress"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsProgressApi,
  type QdsProgressApiProps,
  type QdsProgressEmphasis,
  type QdsProgressLabelOrientation,
  type QdsProgressSize,
} from "@qualcomm-ui/qds-core/progress"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {
  provideQdsProgressContext,
  QdsProgressContextService,
} from "./qds-progress-context.service"

@Directive({
  providers: [provideProgressContext(), provideQdsProgressContext()],
  selector: "[q-progress-root]",
  standalone: false,
})
export class ProgressRootDirective
  extends CoreProgressRootDirective
  implements SignalifyInput<QdsProgressApiProps>, OnInit
{
  /**
   * Governs the color of the progress bar.
   *
   * @default 'primary'
   */
  readonly emphasis = input<QdsProgressEmphasis>()

  /**
   * Governs the placement of the label and value text relative to
   * the progress bar.
   *
   * @option `top`: the label and value text are positioned above the progress bar.
   * @option `side`: the label and value text are positioned on the same horizontal axis as the progress bar, to the left and right, respectively.
   *
   * @default 'top'
   */
  readonly labelOrientation = input<QdsProgressLabelOrientation>()

  /**
   * Governs the height of the progress bar and track.
   *
   * @default 'md'
   */
  readonly size = input<QdsProgressSize>()

  protected readonly qdsProgressService = inject(QdsProgressContextService)

  override ngOnInit() {
    super.ngOnInit()

    this.qdsProgressService.init(
      computed(() =>
        createQdsProgressApi(
          {
            emphasis: this.emphasis(),
            labelOrientation: this.labelOrientation(),
            size: this.size(),
          } satisfies Explicit<QdsProgressApiProps>,
          normalizeProps,
        ),
      ),
    )

    this.trackBindings.extendWith(
      computed(() => this.qdsProgressService.context().getRootBindings()),
    )
  }
}
