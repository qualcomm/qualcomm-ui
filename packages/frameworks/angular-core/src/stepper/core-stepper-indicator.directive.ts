// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useStepperContext} from "./stepper-context.service"
import {useStepperItemContext} from "./stepper-item-context.service"

@Directive()
export class CoreStepperIndicatorDirective implements OnInit {
  protected readonly stepperContext = useStepperContext()
  protected readonly stepperItemContext = useStepperItemContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.stepperContext().getIndicatorBindings(this.stepperItemContext())
  })

  ngOnInit() {
    this.trackBindings()
  }
}
