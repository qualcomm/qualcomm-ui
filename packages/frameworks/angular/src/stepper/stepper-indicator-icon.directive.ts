// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsStepperContext} from "./qds-stepper-context.service"

@Directive({
  selector: "[q-stepper-indicator-icon]",
  standalone: false,
})
export class StepperIndicatorIconDirective implements OnInit {
  protected readonly qdsContext = useQdsStepperContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.qdsContext().getIndicatorIconBindings()
  })

  ngOnInit() {
    this.trackBindings()
  }
}
