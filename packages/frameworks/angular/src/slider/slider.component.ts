// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, Component, computed, input} from "@angular/core"

import {
  provideSliderContext,
  useSliderContext,
} from "@qualcomm-ui/angular-core/slider"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {provideQdsSliderContext} from "./qds-slider-context.service.js"
import {SliderRootDirective} from "./slider-root.directive.js"

@Component({
  providers: [provideSliderContext(), provideQdsSliderContext()],
  selector: "q-slider",
  standalone: false,
  template: `
    <ng-content select="[q-slider-label]">
      @if (label()) {
        <label q-slider-label>
          {{ label() }}
        </label>
      }
    </ng-content>
    @if (!tooltip()) {
      <ng-content select="[q-slider-value-text]">
        <div q-slider-value-text [display]="display()"></div>
      </ng-content>
    }
    @if (sideMarkers()) {
      <ng-content select="[q-slider-min]">
        <span q-slider-min></span>
      </ng-content>
    }

    <ng-content select="[q-slider-control]">
      <div q-slider-control>
        <ng-content select="[q-slider-track]">
          <div q-slider-track>
            <ng-content select="[q-slider-range]">
              <div q-slider-range></div>
            </ng-content>
          </div>
        </ng-content>
        <q-slider-thumbs [tooltip]="tooltip()" />
      </div>
    </ng-content>

    @if (sideMarkers()) {
      <ng-content select="[q-slider-max]">
        <span q-slider-max></span>
      </ng-content>
    } @else {
      <q-slider-markers [marks]="marks()" />
    }

    <ng-content select="[q-slider-error-text]">
      @if (errorText()) {
        <span q-slider-error-text>{{ errorText() }}</span>
      }
    </ng-content>
    <ng-content select="[q-slider-hint]">
      @if (hint()) {
        <span q-slider-hint>{{ hint() }}</span>
      }
    </ng-content>
  `,
})
export class SliderComponent extends SliderRootDirective {
  /**
   * The label text for the slider.
   */
  readonly label = input<string | undefined>()
  /**
   * Optional hint text to display below the slider.
   */
  readonly hint = input<string | undefined>()
  /**
   * The error message to display when the slider value is invalid.
   */
  readonly errorText = input<string | undefined>()
  /**
   * Whether to display markers on the sides of the slider.
   */
  readonly sideMarkers = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })
  /**
   * The list of marks to display along the slider track.
   */
  readonly marks = input<number[]>([])
  /**
   * Whether to display the thumb value as a tooltip.
   */
  readonly tooltip = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })
  /**
   * How to display range values: a separator string or a function that receives the
   * value array and returns a string.
   *
   * @default '—'
   */
  readonly display = input<string | ((value: number[]) => string) | undefined>()

  private readonly sliderContext = useSliderContext()

  readonly thumbs = computed(() =>
    this.sliderContext().value.map((_, idx) => idx),
  )
}
