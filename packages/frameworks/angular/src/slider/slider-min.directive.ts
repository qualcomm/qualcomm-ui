// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {CoreSliderMinDirective} from "@qualcomm-ui/angular-core/slider"

import {useQdsSliderContext} from "./qds-slider-context.service.js"

@Component({
  selector: "[q-slider-min]",
  standalone: false,
  template: "{{ this.sliderContext().min }}",
})
export class SliderMinDirective extends CoreSliderMinDirective {
  protected readonly qdsSliderContext = useQdsSliderContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSliderContext().getMinMaxMarkerBindings()),
    )
  }
}
