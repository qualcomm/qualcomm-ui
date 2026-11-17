// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ComponentProps, type ReactElement, useState} from "react"

import type {
  RangeFilterDefinition,
  RangeFilterValue,
} from "@qualcomm-ui/core/filters"
import {
  useFilterPanelContext,
  useFilterPanelFilter,
} from "@qualcomm-ui/react-core/filter-panel"
import {useQdsFilterPanelContext} from "@qualcomm-ui/react/filter-panel"
import {Slider} from "@qualcomm-ui/react/slider"

import {FilterSection, type FilterSectionProps} from "./filter-section.js"

const DEFAULT_MIN = 0
const DEFAULT_MAX = 100

export interface RangeFilterControlProps extends Omit<
  ComponentProps<typeof Slider>,
  | "defaultValue"
  | "max"
  | "min"
  | "onValueChange"
  | "onValueChangeEnd"
  | "value"
> {}

/**
 * A two-thumb slider. A thumb resting on its bound leaves that side
 * unbounded. Commits when the user releases a thumb.
 */
export function RangeFilterControl(
  props: RangeFilterControlProps,
): ReactElement {
  const api = useFilterPanelContext()
  const filter = useFilterPanelFilter<RangeFilterDefinition>()
  const qdsContext = useQdsFilterPanelContext()
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

  return (
    <Slider
      aria-labelledby={[filter.labelId, filter.labelId]}
      max={max}
      min={min}
      onValueChange={(details) => setDragValue(details.value)}
      onValueChangeEnd={(details) => commit(details.value)}
      size={qdsContext.controlSize}
      value={value}
      {...props}
    />
  )
}

export interface RangeFilterProps
  extends
    FilterSectionProps<RangeFilterDefinition>,
    Omit<RangeFilterControlProps, keyof FilterSectionProps> {}

/**
 * A filter that selects a numeric range with a slider. Bounds come from the
 * definition's `min` and `max`, then the panel's `getFilterRange`. Writes
 * `[number | null, number | null]`.
 */
export function RangeFilter({
  contentProps,
  defaultOpen,
  filter,
  label,
  onOpenChange,
  open,
  rootProps,
  triggerProps,
  ...props
}: RangeFilterProps): ReactElement {
  return (
    <FilterSection
      contentProps={contentProps}
      defaultOpen={defaultOpen}
      filter={filter}
      label={label}
      onOpenChange={onOpenChange}
      open={open}
      rootProps={rootProps}
      triggerProps={triggerProps}
    >
      <RangeFilterControl {...props} />
    </FilterSection>
  )
}
