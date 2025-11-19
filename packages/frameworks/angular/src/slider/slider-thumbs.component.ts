// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, Component, computed, input} from "@angular/core"

import {useSliderContext} from "@qualcomm-ui/angular-core/slider"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

@Component({
  selector: "q-slider-thumbs",
  standalone: false,
  template: `
    @for (idx of thumbs(); track idx) {
      <div q-slider-thumb [index]="idx">
        <input q-slider-hidden-input />
        @if (this.tooltip()) {
          <div q-slider-thumb-indicator></div>
        }
      </div>
    }
  `,
})
export class SliderThumbsComponent {
  /**
   * Whether to display the thumb value as a tooltip.
   */
  readonly tooltip = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  private readonly sliderContext = useSliderContext()

  readonly thumbs = computed(() =>
    this.sliderContext().value.map((_, idx) => idx),
  )
}
