// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ComponentProps, type ReactElement, useState} from "react"

import type {
  RangeFilterDefinition,
  RangeFilterValue,
} from "@qualcomm-ui/core/filters"
import {useFilterSetContext} from "@qualcomm-ui/react-core/filter-set"
import {Slider} from "@qualcomm-ui/react/slider"

import {useFilterWidget} from "./internal/use-filter-widget.js"
import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

const DEFAULT_MIN = 0
const DEFAULT_MAX = 100

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
 * definition's `min` and `max`, then the filter set's `getFilterRange`. A
 * thumb resting on its bound leaves that side unbounded. Commits when the user
 * releases a thumb. Writes `[number | null, number | null]`.
 */
export function SliderFilter(props: SliderFilterProps): ReactElement {
  const api = useFilterSetContext()
  const filter = useFilterWidget<RangeFilterDefinition>("SliderFilter", "range")
  const qdsContext = useQdsFilterControlContext()
  const range = api.getFilterRange(filter.id)
  const min = range.min ?? DEFAULT_MIN
  const max = range.max ?? DEFAULT_MAX
  const [dragValue, setDragValue] = useState<number[] | null>(null)

  const value = dragValue ?? [
    filter.value?.[0] ?? min,
    filter.value?.[1] ?? max,
  ]

  function commit(next: number[]) {
    setDragValue(null)
    const bounds: RangeFilterValue = [
      next[0] <= min ? null : next[0],
      next[1] >= max ? null : next[1],
    ]
    filter.setValue(bounds)
  }

  /**
   * Each thumb reads its accessible name from the array entry at its index.
   */
  const labelProps = filter.labelId
    ? {"aria-labelledby": [filter.labelId, filter.labelId]}
    : {"aria-label": [filter.label, filter.label]}

  return (
    <Slider
      {...labelProps}
      max={max}
      min={min}
      onValueChange={(details) => setDragValue(details.value)}
      onValueChangeEnd={(details) => commit(details.value)}
      size={qdsContext.size}
      value={value}
      {...props}
    />
  )
}
