// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  countFilterValue,
  type FilterCollection,
  type FilterDefinition,
  type FilterDefinitions,
  getFilterValueItems,
  isCollectionFilter,
  removeFilterValueItem,
} from "@qualcomm-ui/core/filters"
import {ListCollection, TreeCollection} from "@qualcomm-ui/utils/collection"
import type {Machine} from "@qualcomm-ui/utils/machine"
import {warnOnce} from "@qualcomm-ui/utils/warning"

import type {
  FilterSetApi,
  FilterSetOptionCounts,
  FilterSetSchema,
} from "./filter-set.types.js"
import {
  areValuesEqual,
  countValues,
  createEmptyValueCheck,
} from "./internal/filter-set.utils.js"

export function createFilterSetApi<
  TDefs extends FilterDefinitions = FilterDefinitions,
>(machine: Machine<FilterSetSchema>): FilterSetApi<TDefs> {
  const {computed, context, prop, send} = machine
  const definitions = prop("filters") as TDefs
  const applyMode = prop("applyMode")
  const isEmpty = createEmptyValueCheck(definitions, prop("isEmptyValue"))
  const draftValue = computed("draftValue")
  const value = context.get("value")
  const draftValueCount = countValues(definitions, isEmpty, draftValue)
  const valueCount =
    applyMode === "auto"
      ? draftValueCount
      : countValues(definitions, isEmpty, value)
  const isDirty =
    applyMode === "manual" && !areValuesEqual(isEmpty, draftValue, value)

  type AnyFilterCollection = FilterCollection<FilterDefinition>

  const collections = new Map<string, AnyFilterCollection | undefined>()

  function resolveFilterCollection(
    id: string,
  ): AnyFilterCollection | undefined {
    const definition: FilterDefinition | undefined = definitions[id]
    if (definition && !isCollectionFilter(definition)) {
      return undefined
    }
    if (definition?.collection) {
      return definition.collection
    }
    const collection = prop("getFilterCollection")?.(id)
    if (!collection || !definition) {
      return collection
    }
    const CollectionType =
      definition.kind === "list" ? ListCollection : TreeCollection
    if (collection instanceof CollectionType) {
      return collection
    }
    warnOnce(
      `filter-set-collection-kind-${id}`,
      `getFilterCollection returned a ${collection.constructor.name} for the ${definition.kind} filter "${id}". The filter needs a ${CollectionType.name}, so the collection is ignored.`,
    )
    return undefined
  }

  function getFilterCollection(id: string): AnyFilterCollection | undefined {
    if (!collections.has(id)) {
      collections.set(id, resolveFilterCollection(id))
    }
    return collections.get(id)
  }

  const optionCounts = new Map<string, FilterSetOptionCounts | undefined>()

  /**
   * Range, date, and text filters have no options to count. Skipping them
   * avoids resolvers that compute counts for every value of a column, such as
   * a table's faceted unique values for a date column.
   */
  const uncountedKinds = new Set(["date", "range", "text"])

  function getFilterOptionCounts(
    id: string,
  ): FilterSetOptionCounts | undefined {
    const definition: FilterDefinition | undefined = definitions[id]
    if (definition && uncountedKinds.has(definition.kind)) {
      return undefined
    }
    if (!optionCounts.has(id)) {
      optionCounts.set(id, prop("getFilterOptionCounts")?.(id, draftValue))
    }
    return optionCounts.get(id)
  }

  function countValue(id: string, filterValue: unknown): number {
    return isEmpty(id, filterValue)
      ? 0
      : countFilterValue(definitions[id], filterValue)
  }

  return {
    apply() {
      send({type: "APPLY"})
    },
    applyMode,
    clearAll() {
      send({type: "CLEAR_ALL"})
    },
    clearDraftValue() {
      send({type: "DRAFT.CLEAR_ALL"})
    },
    clearFilter(id) {
      send({id, type: "FILTER.SET", value: undefined})
    },
    draftValue: draftValue as FilterSetApi<TDefs>["draftValue"],
    draftValueCount,
    filters: definitions,
    getDraftValue(id) {
      return draftValue[id] as ReturnType<FilterSetApi<TDefs>["getDraftValue"]>
    },
    getDraftValueCount(id) {
      return countValue(id, draftValue[id])
    },
    getFilterCollection:
      getFilterCollection as FilterSetApi<TDefs>["getFilterCollection"],
    getFilterLabel(id) {
      return definitions[id]?.label || prop("getFilterLabel")?.(id) || id
    },
    getFilterOptionCounts,
    getFilterRange(id) {
      const definition: FilterDefinition | undefined = definitions[id]
      if (definition && definition.kind !== "range") {
        return {}
      }
      const range =
        definition?.min === undefined || definition.max === undefined
          ? prop("getFilterRange")?.(id)
          : undefined
      return {
        max: definition?.max ?? range?.max,
        min: definition?.min ?? range?.min,
      }
    },
    getValueCount(id) {
      return countValue(id, value[id])
    },
    getValueItems(id) {
      const ids = id === undefined ? Object.keys(value) : [id]
      return ids.flatMap((filterId) => {
        if (isEmpty(filterId, value[filterId])) {
          return []
        }
        const collection = getFilterCollection(filterId)
        return getFilterValueItems(
          definitions[filterId],
          value[filterId],
          (option) => collection?.stringify(option) ?? option,
        ).map((item) => ({...item, filterId}))
      })
    },
    hasDraftValue(id) {
      return !isEmpty(id, draftValue[id])
    },
    isDirty,
    removeFilterValue(id, item) {
      send({
        id,
        type: "FILTER.SET",
        value: (current: unknown) =>
          removeFilterValueItem(definitions[id], current, item),
      })
    },
    reset() {
      send({type: "RESET"})
    },
    setDraftValue(id, filterValue) {
      send({id, type: "DRAFT.SET", value: filterValue})
    },
    setFilterValue(id, filterValue) {
      send({id, type: "FILTER.SET", value: filterValue})
    },
    value: value as FilterSetApi<TDefs>["value"],
    valueCount,
  }
}
