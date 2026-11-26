// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {useRenderStrategyContext} from "@qualcomm-ui/angular-core/presence"

import {useStepperContext} from "./stepper-context.service"

@Directive()
export class CoreStepperContentDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  /**
   * The index of the step this content belongs to
   */
  readonly index = input.required<number>()

  protected readonly stepperContext = useStepperContext()

  protected readonly renderStrategyContext = useRenderStrategyContext({
    optional: true,
  })

  private wasCurrent = false

  /**
   * Whether descendants should be rendered. Wrap content in
   * `@if (content.shouldRender())` to defer creating its components and to
   * destroy them when the step stops being current, when the render strategy
   * requires it.
   */
  readonly shouldRender = computed(() => {
    const {current} = this.stepperContext().getItemState({index: this.index()})
    const {lazyMount, unmountOnExit} = this.renderStrategyContext?.() ?? {}

    if (current) {
      this.wasCurrent = true
    }

    return current || (this.wasCurrent ? !unmountOnExit : !lazyMount)
  })

  protected readonly hostId = computed(() => useId(this, this.id()))

  protected readonly onDestroy = useOnDestroy()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.stepperContext().getContentBindings({
      id: this.hostId(),
      index: this.index(),
      onDestroy: this.onDestroy,
    })
  })

  ngOnInit() {
    this.trackBindings()
  }
}
