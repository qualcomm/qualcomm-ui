// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {createFilterState} from "@qualcomm-ui/core/filter-set"
import type {
  FilterDefinition,
  IdentifiedFilterDefinition,
} from "@qualcomm-ui/core/filters"

import {
  FilterContextProvider,
  type FilterContextValue,
  useFilterContext,
} from "./filter-context.js"
import {useFilterSetContext} from "./filter-set-context.js"

export interface FilterProviderProps<
  TDef extends FilterDefinition = FilterDefinition,
> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * The filter's definition, from the filter set's `filters`.
   */
  filter: IdentifiedFilterDefinition<TDef>

  /**
   * The id of the element that labels the filter. Controls reference it with
   * `aria-labelledby`. When omitted, controls use the filter's label as their
   * `aria-label`.
   */
  labelId?: string | undefined
}

/**
 * Provides one filter's state from the surrounding filter set to its
 * controls. Renders no element of its own, and skips its children when
 * `filter` is missing.
 */
export function FilterProvider<TDef extends FilterDefinition>({
  children,
  filter,
  labelId,
}: FilterProviderProps<TDef>): ReactElement | null {
  const state = createFilterState(useFilterSetContext(), filter, {labelId})

  if (!state) {
    return null
  }

  return (
    <FilterContextProvider value={state as FilterContextValue}>
      {children}
    </FilterContextProvider>
  )
}

/**
 * Returns the state of the surrounding filter. Use inside `FilterProvider` or
 * `FilterPanel.Filter` to build a custom filter control.
 */
export function useFilter<
  TDef extends FilterDefinition = FilterDefinition,
>(): FilterContextValue<TDef> {
  return useFilterContext() as unknown as FilterContextValue<TDef>
}
