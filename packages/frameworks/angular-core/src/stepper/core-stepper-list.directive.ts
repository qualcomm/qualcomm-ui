// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useStepperContext} from "./stepper-context.service"

@Directive()
export class CoreStepperListDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  protected readonly stepperContext = useStepperContext()

  protected readonly hostId = computed(() => useId(this, this.id()))

  protected readonly onDestroy = useOnDestroy()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.stepperContext().getListBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    })
  })

  ngOnInit() {
    this.trackBindings()
  }
}
