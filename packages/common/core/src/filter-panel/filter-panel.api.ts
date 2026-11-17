// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  countFilterValue,
  type FilterDefinitions,
  labelFilterValue,
  normalizeFilterOption,
} from "@qualcomm-ui/core/filters"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import {filterPanelAnatomy} from "./filter-panel.anatomy.js"
import type {
  FilterPanelApi,
  FilterPanelApplyTriggerBindings,
  FilterPanelClearTriggerBindings,
  FilterPanelFilterBindings,
  FilterPanelFilterCountBindings,
  FilterPanelFilterLabelBindings,
  FilterPanelRootBindings,
  FilterPanelSchema,
} from "./filter-panel.types.js"
import {
  areValuesEqual,
  countValues,
  createEmptyValueCheck,
} from "./internal/filter-panel.utils.js"

const parts = filterPanelAnatomy.parts

export function createFilterPanelApi<
  TDefinitions extends FilterDefinitions = FilterDefinitions,
>(
  machine: Machine<FilterPanelSchema>,
  normalize: PropNormalizer,
): FilterPanelApi<TDefinitions> {
  const {computed, context, prop, refs, send} = machine
  const definitions = prop("filters") as TDefinitions | undefined
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
    applyMode === "manual" &&
    !areValuesEqual(isEmpty, context.get("draft"), value)

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
    draftValue: draftValue as FilterPanelApi<TDefinitions>["draftValue"],
    draftValueCount,
    filters: definitions,
    getDraftValue(id) {
      return draftValue[id] as ReturnType<
        FilterPanelApi<TDefinitions>["getDraftValue"]
      >
    },
    getFilterLabel(id) {
      return definitions?.[id]?.label || prop("getFilterLabel")?.(id) || id
    },
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
    value: value as FilterPanelApi<TDefinitions>["value"],
    valueCount,

    // group: bindings
    getApplyTriggerBindings(): FilterPanelApplyTriggerBindings {
      return normalize.button({
        ...parts.applyTrigger,
        "data-disabled": booleanDataAttr(!isDirty),
        disabled: !isDirty,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          send({type: "APPLY"})
        },
        type: "button",
      })
    },
    getClearTriggerBindings(): FilterPanelClearTriggerBindings {
      const disabled = draftValueCount === 0
      return normalize.button({
        ...parts.clearTrigger,
        "data-disabled": booleanDataAttr(disabled),
        disabled,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          send({type: "CLEAR_ALL"})
        },
        type: "button",
      })
    },
    getFilterBindings({id}): FilterPanelFilterBindings {
      return normalize.element({
        ...parts.filter,
        "data-active": booleanDataAttr(!isEmpty(id, draftValue[id])),
        "data-filter-id": id,
      })
    },
    getFilterCountBindings({id}): FilterPanelFilterCountBindings {
      const count = getValueCount(id, draftValue[id])
      return normalize.element({
        ...parts.filterCount,
        "aria-label": `${count} selected`,
        hidden: count === 0,
      })
    },
    getFilterLabelBindings({id}): FilterPanelFilterLabelBindings {
      return normalize.element({
        ...parts.filterLabel,
        "data-active": booleanDataAttr(!isEmpty(id, draftValue[id])),
      })
    },
    getRootBindings(): FilterPanelRootBindings {
      return normalize.element({
        ...parts.root,
        "data-apply-mode": applyMode,
        "data-dirty": booleanDataAttr(isDirty),
      })
    },
  }
}
