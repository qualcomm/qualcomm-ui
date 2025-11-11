// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  CoreSegmentedControlRootDirective,
  provideSegmentedControlContext,
} from "@qualcomm-ui/angular-core/segmented-control"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsSegmentedControlApi,
  type QdsSegmentedControlApiProps,
  type QdsSegmentedControlLayout,
  type QdsSegmentedControlSize,
  type QdsSegmentedControlVariant,
} from "@qualcomm-ui/qds-core/segmented-control"

import {
  provideQdsSegmentedControlContext,
  QdsSegmentedControlContextService,
} from "./qds-segmented-control-context.service.js"

@Directive({
  providers: [
    provideSegmentedControlContext(),
    provideQdsSegmentedControlContext(),
  ],
  selector: "[q-segmented-control]",
  standalone: false,
})
export class SegmentedControlDirective
  extends CoreSegmentedControlRootDirective
  implements SignalifyInput<QdsSegmentedControlApiProps>
{
  /**
   * Governs the width and height of the segmented control as well as the font size
   * of its content.
   */
  readonly size = input<QdsSegmentedControlSize | undefined>()

  /**
   * The style variant of the segmented control.
   */
  readonly variant = input<QdsSegmentedControlVariant | undefined>()

  /**
   * The style variant of the segmented control.
   */
  readonly layout = input<QdsSegmentedControlLayout | undefined>()

  protected readonly qdsSegmentedControlService = inject(
    QdsSegmentedControlContextService,
  )

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        this.qdsSegmentedControlService.context().getGroupBindings(),
      ),
    )
  }

  override ngOnInit() {
    super.ngOnInit()

    const qdsSegmentedControlApi = computed(() =>
      createQdsSegmentedControlApi(
        {
          layout: this.layout(),
          size: this.size(),
          variant: this.variant(),
        },
        normalizeProps,
      ),
    )

    this.qdsSegmentedControlService.init(qdsSegmentedControlApi)
  }
}
