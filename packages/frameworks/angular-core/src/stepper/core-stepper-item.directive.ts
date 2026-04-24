// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {StepperItemProps} from "@qualcomm-ui/core/stepper"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {useStepperContext} from "./stepper-context.service"
import {StepperItemContextService} from "./stepper-item-context.service"

@Directive()
export class CoreStepperItemDirective
  implements OnInit, SignalifyInput<StepperItemProps>
{
  /**
   * The index of the step
   */
  readonly index = input.required<number>()

  protected readonly stepperContext = useStepperContext()
  protected readonly stepperItemApi = inject(StepperItemContextService)

  protected readonly trackBindings = useTrackBindings(() => {
    return this.stepperContext().getItemBindings({index: this.index()})
  })

  ngOnInit() {
    this.stepperItemApi.init(
      computed<Explicit<StepperItemProps>>(() => ({
        index: this.index(),
      })),
    )

    this.trackBindings()
  }
}
