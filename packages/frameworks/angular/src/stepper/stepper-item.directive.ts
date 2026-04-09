// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {
  CoreStepperItemDirective,
  provideStepperItemContext,
} from "@qualcomm-ui/angular-core/stepper"

import {useQdsStepperContext} from "./qds-stepper-context.service"

@Directive({
  providers: [provideStepperItemContext()],
  selector: "[q-stepper-item]",
  standalone: false,
})
export class StepperItemDirective extends CoreStepperItemDirective {
  protected readonly qdsContext = useQdsStepperContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getItemBindings()),
    )
  }
}
