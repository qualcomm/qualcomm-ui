// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  CoreStepperRootDirective,
  provideStepperContext,
} from "@qualcomm-ui/angular-core/stepper"
import {
  createQdsStepperApi,
  type QdsStepperApiProps,
  type QdsStepperSize,
} from "@qualcomm-ui/qds-core/stepper"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {
  provideQdsStepperContext,
  QdsStepperContextService,
} from "./qds-stepper-context.service"

@Directive({
  providers: [provideStepperContext(), provideQdsStepperContext()],
  selector: "[q-stepper-root]",
  standalone: false,
})
export class StepperRootDirective
  extends CoreStepperRootDirective
  implements SignalifyInput<QdsStepperApiProps>
{
  /**
   * The size of the stepper and its elements.
   *
   * @default 'lg'
   */
  readonly size = input<QdsStepperSize>()

  protected readonly qdsStepperService = inject(QdsStepperContextService)

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsStepperService.context().getRootBindings()),
    )
  }

  override ngOnInit() {
    this.qdsStepperService.init(
      computed(() =>
        createQdsStepperApi(
          {
            size: this.size(),
          } satisfies Explicit<QdsStepperApiProps>,
          normalizeProps,
        ),
      ),
    )

    super.ngOnInit()
  }
}
