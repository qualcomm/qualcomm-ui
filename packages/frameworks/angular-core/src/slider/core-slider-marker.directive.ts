// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useSliderContext} from "./slider-context.service.js"

@Directive()
export class CoreSliderMarkerDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()
  /**
   * The value the marker should indicate.
   */
  readonly value = input.required<number>()

  protected readonly hostId = computed(() => useId(this, this.id()))

  protected readonly sliderContext = useSliderContext()

  protected readonly onDestroy = useOnDestroy()

  protected readonly trackBindings = useTrackBindings(() =>
    this.sliderContext().getMarkerBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
      value: this.value(),
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
