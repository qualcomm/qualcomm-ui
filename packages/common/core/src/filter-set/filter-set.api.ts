// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  countFilterValue,
  type FilterDefinition,
  type FilterDefinitions,
  getFilterValueItems,
  isCollectionFilter,
  removeFilterValueItem,
} from "@qualcomm-ui/core/filters"
import type {Machine} from "@qualcomm-ui/utils/machine"

import type {
  FilterSetApi,
  FilterSetCollection,
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
  const definitions = prop("filters") as TDefs | undefined
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

  const collections = new Map<string, FilterSetCollection | undefined>()

  function getFilterCollection(id: string): FilterSetCollection | undefined {
    if (!collections.has(id)) {
      const definition = definitions?.[id]
      collections.set(
        id,
        definition && !isCollectionFilter(definition)
          ? undefined
          : (definition?.collection ?? prop("getFilterCollection")?.(id)),
      )
    }
    return collections.get(id)
  }

  const optionCounts = new Map<string, FilterSetOptionCounts | undefined>()

  function getFilterOptionCounts(
    id: string,
  ): FilterSetOptionCounts | undefined {
    if (!optionCounts.has(id)) {
      optionCounts.set(id, prop("getFilterOptionCounts")?.(id, draftValue))
    }
    return optionCounts.get(id)
  }

  function countValue(id: string, filterValue: unknown): number {
    return isEmpty(id, filterValue)
      ? 0
      : countFilterValue(definitions?.[id], filterValue)
  }

  return {
    apply() {
      send({type: "APPLY"})
    },
    applyMode,
    clearAll() {
      send({type: "CLEAR_ALL"})
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
    getFilterCollection,
    getFilterLabel(id) {
      return definitions?.[id]?.label || prop("getFilterLabel")?.(id) || id
    },
    getFilterOptionCounts,
    getFilterRange(id) {
      const definition: FilterDefinition | undefined = definitions?.[id]
      const bounds = definition?.kind === "range" ? definition : undefined
      const range =
        bounds?.min === undefined || bounds.max === undefined
          ? prop("getFilterRange")?.(id)
          : undefined
      return {
        max: bounds?.max ?? range?.max,
        min: bounds?.min ?? range?.min,
      }
    },
    getValueCount(id) {
      return countValue(id, value[id])
    },
    getValueItems(id) {
      if (isEmpty(id, value[id])) {
        return []
      }
      const collection = getFilterCollection(id)
      return getFilterValueItems(
        definitions?.[id],
        value[id],
        (option) => collection?.stringify(option) ?? option,
      )
    },
    isDirty,
    isFilterActive(id) {
      return !isEmpty(id, draftValue[id])
    },
    removeFilterValue(id, item) {
      send({
        id,
        type: "FILTER.SET",
        value: (current: unknown) =>
          removeFilterValueItem(definitions?.[id], current, item),
      })
    },
    reset() {
      send({type: "RESET"})
    },
    setFilterValue(id, filterValue) {
      send({id, type: "FILTER.SET", value: filterValue})
    },
    value: value as FilterSetApi<TDefs>["value"],
    valueCount,
  }
}
