// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreSliderMarkerGroupDirective} from "@qualcomm-ui/angular-core/slider"

import {useQdsSliderContext} from "./qds-slider-context.service.js"

@Directive({
  selector: "[q-slider-marker-group]",
  standalone: false,
})
export class SliderMarkerGroupDirective extends CoreSliderMarkerGroupDirective {
  protected readonly qdsSliderContext = useQdsSliderContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSliderContext().getMarkerGroupBindings()),
    )
  }
}
