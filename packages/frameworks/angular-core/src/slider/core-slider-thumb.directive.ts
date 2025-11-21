// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {ThumbProps} from "@qualcomm-ui/core/slider"

import {useSliderContext} from "./slider-context.service"
import {SliderThumbContextService} from "./slider-thumb-context.service"

@Directive()
export class CoreSliderThumbDirective
  implements SignalifyInput<ThumbProps>, OnInit
{
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()
  /**
   * The slider thumb's index.
   */
  readonly index = input.required<number>()
  /**
   * The name associated with the slider thumb's input (when used in a form).
   */
  readonly name = input<string>()

  protected readonly sliderThumbContextService = inject(
    SliderThumbContextService,
  )

  protected readonly hostId = computed(() => useId(this, this.id()))

  protected readonly sliderContext = useSliderContext()

  protected readonly onDestroy = useOnDestroy()

  protected readonly trackBindings = useTrackBindings(() =>
    this.sliderContext().getThumbBindings({
      id: this.hostId(),
      index: this.index(),
      name: this.name(),
      onDestroy: this.onDestroy,
    }),
  )

  ngOnInit() {
    this.sliderThumbContextService.init(
      computed(() => ({
        index: this.index(),
        name: this.name(),
      })),
    )

    this.trackBindings()
  }
}
