// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  countFilterValue,
  type FilterDefinitions,
  labelFilterValue,
  normalizeFilterOption,
} from "@qualcomm-ui/core/filters"
import type {Machine} from "@qualcomm-ui/utils/machine"

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
  const {computed, context, prop, refs, send} = machine
  const definitions = prop("filters") as TDefs | undefined
  const applyMode = prop("applyMode")
  const isEmpty = createEmptyValueCheck(definitions, prop("isEmptyValue"))
  const draftValue = computed("draftValue")
  const value = context.get("value")
  const labels = refs.get("labels")
  const draftValueCount = countValues(definitions, isEmpty, draftValue)
  const valueCount =
    applyMode === "auto"
      ? draftValueCount
      : countValues(definitions, isEmpty, value)
  const isDirty =
    applyMode === "manual" && !areValuesEqual(isEmpty, draftValue, value)

  function getFilterOptionLabel(id: string, option: string): string {
    const definition = definitions?.[id]
    const definitionLabel =
      definition && "getOptionLabel" in definition
        ? definition.getOptionLabel?.(option)
        : undefined
    return (
      definitionLabel ??
      labels[id]?.[option] ??
      prop("getFilterOptionLabel")?.(id, option) ??
      option
    )
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
    getFilterLabel(id) {
      return definitions?.[id]?.label || prop("getFilterLabel")?.(id) || id
    },
    getFilterOptionCount,
    getFilterOptionLabel,
    getFilterOptions(id) {
      const definition = definitions?.[id]
      const options =
        (definition && "options" in definition
          ? definition.options
          : undefined) ?? prop("getFilterOptions")?.(id)
      return options?.map(normalizeFilterOption) ?? []
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
    setFilterValue(id, filterValue, details) {
      send({
        id,
        labels: details?.labels,
        type: "FILTER.SET",
        value: filterValue,
      })
    },
    value: value as FilterSetApi<TDefs>["value"],
    valueCount,
  }
}
