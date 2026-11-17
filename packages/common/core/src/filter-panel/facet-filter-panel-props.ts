// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FilterOptionObject} from "@qualcomm-ui/core/filters"
import type {
  FacetFilter,
  FacetFilterItem,
  FacetFilterResult,
  FacetSelections,
} from "@qualcomm-ui/utils/facet-filter"

import type {
  FilterPanelOptionCounts,
  FilterPanelValues,
} from "./filter-panel.types.js"
import {hashValues} from "./internal/filter-panel.utils.js"

export interface FacetFilterPanelOptions {
  /**
   * Returns the ids of the items that pass the filters `FacetFilter` can't
   * apply, such as text, range, and date filters, or a separate text search.
   * Called with the same values as the counts. Return `undefined` to include
   * every item.
   */
  getCandidateIds?:
    | ((values: FilterPanelValues) => readonly string[] | undefined)
    | undefined
}

export interface FacetFilterPanelProps {
  getFilterOptionCounts: (
    id: string,
    values: FilterPanelValues,
  ) => FilterPanelOptionCounts | undefined
  getFilterOptions: (id: string) => FilterOptionObject[] | undefined
}

/**
 * Converts filter panel values to `FacetFilter` selections. Only `string[]`
 * values of configured fields are facets.
 */
function toFacetSelections(
  fields: readonly string[],
  values: FilterPanelValues,
): FacetSelections {
  return Object.fromEntries(
    Object.entries(values).filter(
      (entry): entry is [string, string[]] =>
        fields.includes(entry[0]) &&
        Array.isArray(entry[1]) &&
        entry[1].every((value) => typeof value === "string"),
    ),
  )
}

/**
 * Returns filter panel props that resolve options and option counts from a
 * `FacetFilter`. Filter ids match the facet filter's field names. Ids without
 * a matching field fall back to the panel defaults.
 */
export function getFacetFilterPanelProps<Item extends FacetFilterItem>(
  facetFilter: FacetFilter<Item>,
  options: FacetFilterPanelOptions = {},
): FacetFilterPanelProps {
  const {getCandidateIds} = options
  const fields = facetFilter.fields
  let cached: {key: string; result: FacetFilterResult} | undefined

  function run(values: FilterPanelValues): FacetFilterResult {
    const key = hashValues(values)
    if (cached?.key !== key) {
      cached = {
        key,
        result: facetFilter.filter({
          ids: getCandidateIds?.(values),
          selections: toFacetSelections(fields, values),
        }),
      }
    }
    return cached.result
  }

  return {
    getFilterOptionCounts: (id, values) => {
      const buckets = fields.includes(id) ? run(values).facets[id] : undefined
      return buckets
        ? new Map(buckets.map((bucket) => [bucket.key, bucket.docCount]))
        : undefined
    },
    getFilterOptions: (id) =>
      fields.includes(id)
        ? facetFilter.getValues(id).map((value) => ({label: value, value}))
        : undefined,
  }
}
