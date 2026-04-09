// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreStepperLabelDirective} from "@qualcomm-ui/angular-core/stepper"

import {useQdsStepperContext} from "./qds-stepper-context.service"

@Directive({
  selector: "[q-stepper-label]",
  standalone: false,
})
export class StepperLabelDirective extends CoreStepperLabelDirective {
  protected readonly qdsContext = useQdsStepperContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getLabelBindings()),
    )
  }
}
