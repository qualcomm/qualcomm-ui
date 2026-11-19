// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  countFilterValue,
  type FilterDefinitions,
  isCollectionFilter,
  labelFilterValue,
} from "@qualcomm-ui/core/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"
import {isEqual} from "@qualcomm-ui/utils/equal"
import type {Machine} from "@qualcomm-ui/utils/machine"

import type {
  FilterSetApi,
  FilterSetCollectionState,
  FilterSetOption,
  FilterSetOptionCounts,
  FilterSetSchema,
  FilterSetValueItem,
} from "./filter-set.types.js"
import {
  areValuesEqual,
  countValues,
  createEmptyValueCheck,
  findCollectionItem,
  getCollectionState,
  getSelectedValues,
  getSelectionValues,
  getUncapturedValues,
} from "./internal/filter-set.utils.js"

export function createFilterSetApi<
  TDefs extends FilterDefinitions = FilterDefinitions,
>(machine: Machine<FilterSetSchema>): FilterSetApi<TDefs> {
  const {computed, context, prop, refs, send} = machine
  const definitions = prop("filters") as TDefs | undefined
  const applyMode = prop("applyMode")
  const isEmpty = createEmptyValueCheck(definitions, prop("isEmptyValue"))
  const draftValue = computed("draftValue")
  const value = context.get("value")
  const captured = refs.get("items")
  const draftValueCount = countValues(definitions, isEmpty, draftValue)
  const valueCount =
    applyMode === "auto"
      ? draftValueCount
      : countValues(definitions, isEmpty, value)
  const isDirty =
    applyMode === "manual" && !areValuesEqual(isEmpty, draftValue, value)

  const collectionStates = new Map<
    string,
    FilterSetCollectionState | undefined
  >()

  function getFilterCollectionState(
    id: string,
  ): FilterSetCollectionState | undefined {
    if (!collectionStates.has(id)) {
      collectionStates.set(
        id,
        getCollectionState(
          definitions?.[id],
          id,
          prop("getFilterCollection"),
          getUncapturedValues(
            captured[id],
            getSelectionValues(value[id], draftValue[id]),
          ),
        ),
      )
    }
    return collectionStates.get(id)
  }

  function getValueItem(id: string, option: string): FilterSetValueItem {
    const state = getFilterCollectionState(id)
    const found =
      findCollectionItem(state?.collection, option) ?? captured[id]?.[option]
    if (found) {
      return {label: found.label, status: "resolved", value: option}
    }
    return {
      label: option,
      status: state?.status === "loading" ? "loading" : "missing",
      value: option,
    }
  }

  function getFilterOptionLabel(id: string, option: string): string {
    return getValueItem(id, option).label
  }

  const optionCounts = new Map<string, FilterSetOptionCounts | undefined>()

  function getFilterOptionCount(
    id: string,
    option: string,
  ): number | undefined {
    if (!optionCounts.has(id)) {
      optionCounts.set(id, prop("getFilterOptionCounts")?.(id, draftValue))
    }
    const counts = optionCounts.get(id)
    if (!counts) {
      return undefined
    }
    const count =
      counts instanceof Map
        ? counts.get(option)
        : (counts as Record<string, unknown>)[option]
    /**
     * Record lookups can reach inherited properties such as `constructor`.
     */
    return typeof count === "number" ? count : 0
  }

  function getValueCount(id: string, filterValue: unknown): number {
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
    getFilterCollectionState,
    getFilterLabel(id) {
      return definitions?.[id]?.label || prop("getFilterLabel")?.(id) || id
    },
    getFilterOptionCount,
    getFilterOptionLabel,
    getFilterOptions(id) {
      const collection = getFilterCollectionState(id)?.collection
      const selected = getSelectedValues(draftValue[id])
      const options: FilterSetOption[] = []

      if (collection instanceof ListCollection) {
        for (const item of collection.items) {
          const option = collection.getItemValue(item)
          if (option === null) {
            continue
          }
          const count = getFilterOptionCount(id, option)
          options.push({
            count,
            disabled:
              !!collection.getItemDisabled(item) ||
              (count === 0 && !selected.includes(option)),
            label: collection.stringifyItem(item) ?? option,
            status: "resolved",
            value: option,
          })
        }
      }

      for (const option of selected) {
        if (!options.some((existing) => existing.value === option)) {
          options.push({...getValueItem(id, option), disabled: false})
        }
      }

      const previous = refs.get("options")[id]
      if (previous && isEqual(previous, options)) {
        return previous
      }
      refs.set("options", {...refs.get("options"), [id]: options})
      return options
    },
    getFilterRange(id) {
      const definition = definitions?.[id]
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
    getValueCount,
    getValueItems(id, filterValue) {
      if (isEmpty(id, filterValue)) {
        return []
      }
      const definition = definitions?.[id]
      if (
        isCollectionFilter(definition) ||
        (!definition && Array.isArray(filterValue))
      ) {
        return getSelectedValues(filterValue).map((option) =>
          getValueItem(id, option),
        )
      }
      return labelFilterValue(definition, filterValue, (option) =>
        getFilterOptionLabel(id, option),
      ).map((label) => ({label, status: "resolved", value: label}))
    },
    getValueLabels(id, filterValue) {
      if (isEmpty(id, filterValue)) {
        return []
      }
      return labelFilterValue(definitions?.[id], filterValue, (option) =>
        getFilterOptionLabel(id, option),
      )
    },
    isDirty,
    isFilterActive(id) {
      return !isEmpty(id, draftValue[id])
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
