// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useEffect} from "react"

import {
  type FilterDefinition,
  type FilterDefinitions,
  type IdentifiedFilterDefinition,
  isCollectionFilter,
} from "@qualcomm-ui/core/filters"
import {warn} from "@qualcomm-ui/utils/warning"

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
 * Returns a warning when the filter is missing or its id isn't in the filter
 * set's definitions, which resolve its collection, label, and empty values.
 * Definitions are matched by id, not identity, since valid code can pass an
 * equivalent definition object.
 */
function getDefinitionMismatch(
  filters: FilterDefinitions,
  filter: IdentifiedFilterDefinition | undefined,
): string | undefined {
  if (!filter) {
    return "FilterProvider received no filter definition, so it renders nothing. Pass a definition from the filter set's filters. In a nested component, pass their type to useFilterSetContext, such as useFilterSetContext<typeof filters>(), so that a missing filter is a type error."
  }
  const definition: FilterDefinition | undefined = filters[filter.id]
  if (!definition) {
    return `Filter "${filter.id}" isn't in the filter set's filters. Add its definition to the filters passed to the filter set.`
  }
  return undefined
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
  const api = useFilterSetContext()
  const mismatch = getDefinitionMismatch(api.filters, filter)

  useEffect(() => {
    if (mismatch) {
      warn(mismatch)
    }
  }, [mismatch])

  if (!filter) {
    return null
  }

  const {id} = filter
  const value = api.getDraftValue(id)

  const context: FilterContextValue = {
    clear: () => api.setDraftValue(id, undefined),
    collection: isCollectionFilter(filter)
      ? api.getFilterCollection(id)
      : undefined,
    count: api.getDraftValueCount(id),
    definition: filter,
    id,
    isActive: api.hasDraftValue(id),
    label: api.getFilterLabel(id),
    labelId,
    optionCounts: api.getFilterOptionCounts(id),
    setValue: (next) => api.setDraftValue(id, next),
    value,
  }

  return (
    <FilterContextProvider value={context}>{children}</FilterContextProvider>
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
