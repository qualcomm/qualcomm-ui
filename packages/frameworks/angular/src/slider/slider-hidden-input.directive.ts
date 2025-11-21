// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreSliderHiddenInputDirective} from "@qualcomm-ui/angular-core/slider"

import {useQdsSliderContext} from "./qds-slider-context.service"

@Directive({
  selector: "[q-slider-hidden-input]",
  standalone: false,
})
export class SliderHiddenInputDirective extends CoreSliderHiddenInputDirective {
  protected readonly qdsSliderContext = useQdsSliderContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSliderContext().getHiddenInputBindings()),
    )
  }
}
