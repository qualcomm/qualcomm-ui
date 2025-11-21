// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {CoreSliderMaxDirective} from "@qualcomm-ui/angular-core/slider"

import {useQdsSliderContext} from "./qds-slider-context.service"

@Component({
  selector: "[q-slider-max]",
  standalone: false,
  template: "{{ this.sliderContext().max }}",
})
export class SliderMaxDirective extends CoreSliderMaxDirective {
  protected readonly qdsSliderContext = useQdsSliderContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSliderContext().getMinMaxMarkerBindings()),
    )
  }
}
