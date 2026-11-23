// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ComponentProps, type ReactElement, useState} from "react"

import {createSliderFilterApi} from "@qualcomm-ui/core/filter-control"
import type {RangeFilterDefinition} from "@qualcomm-ui/core/filters"
import {
  useFilter,
  useFilterSetContext,
} from "@qualcomm-ui/react-core/filter-set"
import {Slider} from "@qualcomm-ui/react/slider"

import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface SliderFilterProps extends Omit<
  ComponentProps<typeof Slider>,
  | "defaultValue"
  | "max"
  | "min"
  | "onValueChange"
  | "onValueChangeEnd"
  | "value"
> {}

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
 */
export function SliderFilter(props: SliderFilterProps): ReactElement {
  const filterSet = useFilterSetContext()
  const filter = useFilter<RangeFilterDefinition>()
  const [dragValue, setDragValue] = useState<number[] | null>(null)
  const api = createSliderFilterApi(filter, {
    dragValue,
    range: filterSet.getFilterRange(filter.id),
  })
  const qdsContext = useQdsFilterControlContext()

  return (
    <Slider
      {...api.getThumbLabelProps()}
      disabled={api.disabled}
      marks={api.marks}
      max={api.max}
      min={api.min}
      onValueChange={(details) => setDragValue(details.value)}
      onValueChangeEnd={(details) => {
        setDragValue(null)
        api.commit(details.value)
      }}
      size={qdsContext.size}
      value={api.value}
      {...props}
    />
  )
}
