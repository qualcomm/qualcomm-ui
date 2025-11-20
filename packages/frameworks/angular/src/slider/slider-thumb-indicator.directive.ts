// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import {CoreSliderThumbIndicatorDirective} from "@qualcomm-ui/angular-core/slider"

import {useQdsSliderContext} from "./qds-slider-context.service.js"

@Component({
  selector: "[q-slider-thumb-indicator]",
  standalone: false,
  template: "{{valueText()}}",
})
export class SliderThumbIndicatorDirective extends CoreSliderThumbIndicatorDirective {
  /**
   * Custom value display: a function that receives the value and returns a
   * string.
   *
   * @default ' - '
   */
  readonly display = input<(value: number) => string>()

  readonly valueText = computed(() => {
    const display = this.display()
    return typeof display === "function" ? display(this.value()) : this.value()
  })

  protected readonly qdsSliderContext = useQdsSliderContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSliderContext().getThumbIndicatorBindings()),
    )
  }
}
