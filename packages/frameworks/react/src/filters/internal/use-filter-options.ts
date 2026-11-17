// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type FilterOption,
  type FilterOptionObject,
  normalizeFilterOption,
} from "@qualcomm-ui/core/filters"
import {
  useFilterPanelContext,
  useFilterPanelFilter,
} from "@qualcomm-ui/react-core/filter-panel"

/**
 * Resolves a filter's options: the component's `options`, then the
 * definition's, then the panel's resolver (table facets, for example).
 * Selected values missing from the options are appended so they stay visible
 * and can be deselected.
 */
export function useFilterOptions(
  options: FilterOption[] | undefined,
): FilterOptionObject[] {
  const api = useFilterPanelContext()
  const filter = useFilterPanelFilter()

  const resolved = options
    ? options.map(normalizeFilterOption)
    : api.getFilterOptions(filter.id)

  const selected = Array.isArray(filter.value) ? (filter.value as string[]) : []
  const missing = selected
    .filter((value) => !resolved.some((option) => option.value === value))
    .map((value) => ({
      label: api.getFilterOptionLabel(filter.id, value),
      value,
    }))

  return missing.length ? [...resolved, ...missing] : resolved
}

export function getOptionLabels(
  options: FilterOptionObject[],
  values: string[],
): Record<string, string> {
  return Object.fromEntries(
    options
      .filter((option) => values.includes(option.value))
      .map((option) => [option.value, option.label]),
  )
}
