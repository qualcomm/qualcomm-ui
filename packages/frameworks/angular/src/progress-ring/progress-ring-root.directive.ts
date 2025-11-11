// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  CoreProgressRingRootDirective,
  provideProgressRingContext,
} from "@qualcomm-ui/angular-core/progress-ring"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsProgressRingApi,
  type QdsProgressRingApiProps,
  type QdsProgressRingEmphasis,
  type QdsProgressRingSize,
} from "@qualcomm-ui/qds-core/progress-ring"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {
  provideQdsProgressRingContext,
  QdsProgressRingContextService,
} from "./qds-progress-ring-context.service"

@Directive({
  providers: [provideProgressRingContext(), provideQdsProgressRingContext()],
  selector: "[q-progress-ring-root]",
  standalone: false,
})
export class ProgressRingRootDirective
  extends CoreProgressRingRootDirective
  implements SignalifyInput<QdsProgressRingApiProps>
{
  /**
   * Governs the color of the progress circle.
   *
   * @default 'primary'
   */
  readonly emphasis = input<QdsProgressRingEmphasis>()

  /**
   * Governs the height of the progress circle and track.
   *
   * @default 'md'
   */
  readonly size = input<QdsProgressRingSize>()

  /**
   * The thickness of the progress ring in pixels. If supplied as a number, it
   * will be used as the pixel value.
   *
   * The default value varies based on the {@link size} of the progress circle.
   */
  readonly thickness = input<string | number | undefined>()

  protected readonly qdsProgressRingService = inject(
    QdsProgressRingContextService,
  )

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsProgressRingService.context().getRootBindings()),
    )

    this.qdsProgressRingService.init(
      computed(() =>
        createQdsProgressRingApi(
          {
            emphasis: this.emphasis(),
            size: this.size(),
            thickness: this.thickness(),
          } satisfies Explicit<QdsProgressRingApiProps>,
          normalizeProps,
        ),
      ),
    )
  }
}
