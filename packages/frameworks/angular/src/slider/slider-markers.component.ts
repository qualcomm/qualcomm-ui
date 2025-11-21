// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import {useSliderContext} from "@qualcomm-ui/angular-core/slider"

@Component({
  selector: "q-slider-markers",
  standalone: false,
  template: `
    <div q-slider-marker-group>
      @for (mark of markerValues(); track mark) {
        <span q-slider-marker [value]="mark">{{ mark }}</span>
      }
    </div>
  `,
})
export class SliderMarkersComponent {
  /**
   * An array of numbers indicating where to place the markers. If not
   * provided, the component will generate 11 evenly spaced markers based on
   * the `min` and `max` slider values.
   */
  readonly marks = input<number[]>([])

  private readonly sliderContext = useSliderContext()

  protected readonly markerValues = computed(() => {
    const marks = this.marks()
    return Array.isArray(marks) && marks.length > 0
      ? marks
      : this.sliderContext().getDefaultMarks()
  })
}
