// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import {CoreSliderValueTextDirective} from "@qualcomm-ui/angular-core/slider"

import {useQdsSliderContext} from "./qds-slider-context.service.js"

@Component({
  selector: "[q-slider-value-text]",
  standalone: false,
  template: "{{valueText()}}",
})
export class SliderValueTextDirective extends CoreSliderValueTextDirective {
  /**
   * How to display range values: a separator string or a function that receives the
   * value array and returns a React node.
   *
   * @default ' - '
   */
  readonly display = input<string | ((value: number[]) => string)>()

  readonly valueText = computed(() => {
    const value = this.sliderContext().value
    const display = this.display()
    if (typeof display === "function") {
      return display(value)
    }
    if (typeof display === "string") {
      return value.join(display)
    }
    return value.join(" - ")
  })

  protected readonly qdsSliderContext = useQdsSliderContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSliderContext().getValueTextBindings()),
    )
  }
}
