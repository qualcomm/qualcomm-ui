// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {
  CoreSliderThumbDirective,
  provideSliderThumbContext,
} from "@qualcomm-ui/angular-core/slider"

import {useQdsSliderContext} from "./qds-slider-context.service"

@Directive({
  providers: [provideSliderThumbContext()],
  selector: "[q-slider-thumb]",
  standalone: false,
})
export class SliderThumbDirective extends CoreSliderThumbDirective {
  protected readonly qdsSliderContext = useQdsSliderContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSliderContext().getThumbBindings()),
    )
  }
}
