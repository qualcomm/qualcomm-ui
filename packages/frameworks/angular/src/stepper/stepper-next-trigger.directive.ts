// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreStepperNextTriggerDirective} from "@qualcomm-ui/angular-core/stepper"

import {useQdsStepperContext} from "./qds-stepper-context.service"

@Directive({
  selector: "[q-stepper-next-trigger]",
  standalone: false,
})
export class StepperNextTriggerDirective extends CoreStepperNextTriggerDirective {
  protected readonly qdsContext = useQdsStepperContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getNextTriggerBindings()),
    )
  }
}
