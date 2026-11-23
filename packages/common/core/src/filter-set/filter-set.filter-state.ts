// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type FilterDefinition,
  type IdentifiedFilterDefinition,
  isCollectionFilter,
} from "@qualcomm-ui/core/filters"
import {warnOnce} from "@qualcomm-ui/utils/warning"

import type {
  FilterSetApi,
  FilterState,
  FilterStateOptions,
} from "./filter-set.types.js"

/**
 * Returns the state of one filter in a filter set, or `undefined` when
 * `filter` is missing. Warns in development when the filter is missing or its
 * id isn't in the filter set's definitions, which resolve its collection,
 * label, and empty values. Definitions are matched by id, not identity, since
 * valid code can pass an equivalent definition object.
 */
export function createFilterState<
  TDef extends FilterDefinition = FilterDefinition,
>(
  filterSet: FilterSetApi<any>,
  filter: IdentifiedFilterDefinition<TDef> | undefined,
  options: FilterStateOptions = {},
): FilterState<TDef> | undefined {
  if (!filter) {
    warnOnce(
      "filter-state-missing-definition",
      "FilterProvider received no filter definition, so it renders nothing. Pass a definition from the filter set's filters. In a nested component, type the filter set's context with the definitions, such as `typeof filters`, so that a missing filter is a type error.",
    )
    return undefined
  }

  const {id} = filter
  const definition: FilterDefinition | undefined = filterSet.filters[id]
  if (!definition) {
    warnOnce(
      `filter-state-unknown-${id}`,
      `Filter "${id}" isn't in the filter set's filters. Add its definition to the filters passed to the filter set.`,
    )
  }

  const state: FilterState = {
    clear: () => filterSet.setDraftValue(id, undefined),
    collection: isCollectionFilter(filter)
      ? filterSet.getFilterCollection(id)
      : undefined,
    count: filterSet.getDraftValueCount(id),
    definition: filter,
    id,
    isActive: filterSet.hasDraftValue(id),
    label: filterSet.getFilterLabel(id),
    labelId: options.labelId,
    optionCounts: filterSet.getFilterOptionCounts(id),
    setValue: (next) => filterSet.setDraftValue(id, next),
    value: filterSet.getDraftValue(id),
  }
  return state as unknown as FilterState<TDef>
}
