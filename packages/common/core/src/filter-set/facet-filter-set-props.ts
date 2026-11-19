// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FilterOptionObject} from "@qualcomm-ui/core/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"
import type {
  FacetFilter,
  FacetFilterItem,
  FacetFilterResult,
  FacetSelections,
} from "@qualcomm-ui/utils/facet-filter"

import type {
  FilterSetApiProps,
  FilterSetOptionCounts,
  FilterSetValues,
} from "./filter-set.types.js"
import {hashValues} from "./internal/filter-set.utils.js"

export interface FacetFilterSetOptions {
  /**
   * Returns the ids of the items that pass the filters `FacetFilter` can't
   * apply, such as text, range, and date filters, or a separate text search.
   * Called with the same values as the counts. Return `undefined` to include
   * every item.
   */
  getCandidateIds?:
    | ((values: FilterSetValues) => readonly string[] | undefined)
    | undefined
}

export interface FacetFilterSetProps {
  getFilterCollection: NonNullable<FilterSetApiProps["getFilterCollection"]>
  getFilterOptionCounts: (
    id: string,
    values: FilterSetValues,
  ) => FilterSetOptionCounts | undefined
}

/**
 * Converts filter set values to `FacetFilter` selections. Only `string[]`
 * values of configured fields are facets.
 */
function toFacetSelections(
  fields: readonly string[],
  values: FilterSetValues,
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
 * Returns filter set props that resolve collections and option counts from a
 * `FacetFilter`. Filter ids match the facet filter's field names. Ids without
 * a matching field fall back to the filter set defaults.
 */
export function getFacetFilterSetProps<Item extends FacetFilterItem>(
  facetFilter: FacetFilter<Item>,
  options: FacetFilterSetOptions = {},
): FacetFilterSetProps {
  const {getCandidateIds} = options
  const fields = facetFilter.fields
  let cached: {key: string; result: FacetFilterResult} | undefined
  const collections = new Map<
    string,
    {collection: ListCollection<FilterOptionObject>; values: readonly string[]}
  >()

  function run(values: FilterSetValues): FacetFilterResult {
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
    getFilterCollection: (id) => {
      if (!fields.includes(id)) {
        return undefined
      }
      const values = facetFilter.getValues(id)
      let collection = collections.get(id)
      if (collection?.values !== values) {
        collection = {
          collection: new ListCollection<FilterOptionObject>({
            items: values.map((value) => ({label: value, value})),
          }),
          values,
        }
        collections.set(id, collection)
      }
      return {collection: collection.collection, status: "success"}
    },
    getFilterOptionCounts: (id, values) => {
      const buckets = fields.includes(id) ? run(values).facets[id] : undefined
      return buckets
        ? new Map(buckets.map((bucket) => [bucket.key, bucket.docCount]))
        : undefined
    },
  }
}
