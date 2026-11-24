// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  CollectionFilterId,
  FilterDefinitions,
  FilterId,
  FilterOptionObject,
  FilterValues,
} from "@qualcomm-ui/core/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"
import type {
  FacetIndex,
  FacetIndexResult,
  FacetSelections,
} from "@qualcomm-ui/utils/facet-index"

import type {
  FilterSetOptionCounts,
  FilterSetValues,
} from "./filter-set.types.js"
import {hashValues} from "./internal/filter-set.utils.js"

export interface FacetFilterSetOptions<
  TDefs extends FilterDefinitions = FilterDefinitions,
> {
  /**
   * Returns the ids of the items that pass the filters `FacetIndex` can't
   * apply, such as text, range, and date filters, or a separate text search.
   * Called with the same values as the counts. Return `undefined` to include
   * every item.
   */
  getCandidateIds?:
    | ((values: FilterValues<TDefs>) => readonly string[] | undefined)
    | undefined
}

export interface FacetFilterSetProps<
  TDefs extends FilterDefinitions = FilterDefinitions,
> {
  getFilterCollection: (
    id: CollectionFilterId<TDefs>,
  ) => ListCollection<FilterOptionObject> | undefined
  getFilterOptionCounts: (
    id: FilterId<TDefs>,
    values: FilterValues<TDefs>,
  ) => FilterSetOptionCounts | undefined
}

/**
 * Converts filter set values to `FacetIndex` selections. Only `string[]`
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
 * `FacetIndex`. Filter ids match the index's field names. Ids without
 * a matching field fall back to the filter set defaults. Collections hold
 * `FilterOptionObject` items, so list filters without their own collection
 * must use that item type. Tree filters take their tree from their definition,
 * and the counts apply to its leaves. Pass the type of the filter definitions,
 * `getFacetFilterSetProps<typeof filters>(facetIndex)`, to type the filter ids
 * and the values `getCandidateIds` receives.
 */
export function getFacetFilterSetProps<
  TDefs extends FilterDefinitions = FilterDefinitions,
>(
  facetIndex: Pick<
    FacetIndex<never, string>,
    "fields" | "filter" | "getValues"
  >,
  options: FacetFilterSetOptions<TDefs> = {},
): FacetFilterSetProps<TDefs> {
  const {getCandidateIds} = options
  const fields = facetIndex.fields
  let cached: {key: string; result: FacetIndexResult} | undefined
  const collections = new Map<
    string,
    {collection: ListCollection<FilterOptionObject>; values: readonly string[]}
  >()

  function run(values: FilterValues<TDefs>): FacetIndexResult {
    const key = hashValues(values)
    if (cached?.key !== key) {
      cached = {
        key,
        result: facetIndex.filter({
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
      const values = facetIndex.getValues(id)
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
      return collection.collection
    },
    getFilterOptionCounts: (id, values) => {
      const buckets = fields.includes(id) ? run(values).facets[id] : undefined
      return buckets
        ? Object.fromEntries(
            buckets.map((bucket) => [bucket.key, bucket.docCount]),
          )
        : undefined
    },
  }
}
