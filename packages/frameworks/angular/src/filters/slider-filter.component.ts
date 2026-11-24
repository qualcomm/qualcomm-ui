// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  input,
  signal,
} from "@angular/core"

import {
  useFilter,
  useFilterSetContext,
} from "@qualcomm-ui/angular-core/filter-set"
import {
  createSliderFilterApi,
  type SliderFilterThumbLabelProps,
} from "@qualcomm-ui/core/filter-control"
import type {RangeFilterDefinition} from "@qualcomm-ui/core/filters"
import type {
  ValueChangeDetails,
  ValueTextDetails,
} from "@qualcomm-ui/core/slider"
import {filterControlClasses} from "@qualcomm-ui/qds-core/filter-control"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {useQdsFilterControlContext} from "./qds-filter-control-context.service"

/**
 * A two-thumb slider that selects a numeric range. Bounds come from the
 * definition's `min` and `max`, then the filter set's `getFilterRange`. Equal
 * bounds disable the slider, since there is no range to narrow. A thumb
 * resting on its bound leaves that side unbounded. Commits when the user
 * releases a thumb. Writes `[number | null, number | null]`.
 *
 * Only the bounds are marked along the track. Bounds that come from data are
 * arbitrary, so evenly spaced marks between them land on fractional values and
 * overlap in narrow containers like filter panels and popovers.
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-filter [filter]="filters.price">
 *   <q-slider-filter [step]="10" />
 * </div>
 * ```
 */
@Component({
  host: {
    "[class]": "filterControlClasses.host",
  },
  selector: "q-slider-filter",
  standalone: false,
  template: `
    @if (api(); as api) {
      <q-slider
        [aria-label]="thumbLabelProps()['aria-label']"
        [aria-labelledby]="thumbLabelProps()['aria-labelledby']"
        [disabled]="api.disabled"
        [getAriaValueText]="getAriaValueText()"
        [marks]="api.marks"
        [max]="api.max"
        [min]="api.min"
        [minStepsBetweenThumbs]="minStepsBetweenThumbs()"
        [ngModel]="api.value"
        [ngModelOptions]="{standalone: true}"
        [size]="qdsContext().size"
        [step]="step()"
        [tooltip]="tooltip()"
        (ngModelChange)="dragValue.set($event)"
        (valueChangedEnd)="commit($event)"
      />
    }
  `,
})
export class SliderFilterComponent {
  /**
   * Function that returns a human readable value for the slider thumb
   */
  readonly getAriaValueText = input<
    ((details: ValueTextDetails) => string) | undefined
  >()

  /**
   * The minimum permitted steps between multiple thumbs.
   *
   * @default 0
   */
  readonly minStepsBetweenThumbs = input<number | undefined>()

  /**
   * The step value of the slider
   *
   * @default 1
   */
  readonly step = input<number | undefined>()

  /**
   * Whether to display the thumb value as a tooltip.
   */
  readonly tooltip = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  protected readonly filterControlClasses = filterControlClasses

  protected readonly filterSet = useFilterSetContext()

  protected readonly filter = useFilter<RangeFilterDefinition>()

  protected readonly qdsContext = useQdsFilterControlContext()

  /**
   * The thumb positions while the user drags, before they're committed.
   */
  protected readonly dragValue = signal<number[] | null>(null)

  protected readonly api = computed(() => {
    const filter = this.filter()
    return filter
      ? createSliderFilterApi(filter, {
          dragValue: this.dragValue(),
          range: this.filterSet().getFilterRange(filter.id),
        })
      : undefined
  })

  protected readonly thumbLabelProps = computed<SliderFilterThumbLabelProps>(
    () => this.api()?.getThumbLabelProps() ?? {},
  )

  protected commit(details: ValueChangeDetails) {
    this.dragValue.set(null)
    this.api()?.commit(details.value)
  }
}
