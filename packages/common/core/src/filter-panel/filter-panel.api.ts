// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import {filterPanelAnatomy} from "./filter-panel.anatomy.js"
import type {
  FilterPanelApi,
  FilterPanelApplyTriggerBindings,
  FilterPanelClearTriggerBindings,
  FilterPanelRootBindings,
  FilterPanelSchema,
} from "./filter-panel.types.js"
import {
  areFiltersEqual,
  countFilters,
  getFilterValue,
  stringifyFilterValue,
} from "./internal/filter-panel.utils.js"

const parts = filterPanelAnatomy.parts

export function createFilterPanelApi(
  machine: Machine<FilterPanelSchema>,
  normalize: PropNormalizer,
): FilterPanelApi {
  const {computed, context, prop, send} = machine
  const isEmptyValue = prop("isEmptyValue")
  const applyMode = prop("applyMode")
  const filters = computed("filters")
  const filterCount = countFilters(isEmptyValue, filters)
  const isDirty =
    applyMode === "manual" &&
    !areFiltersEqual(isEmptyValue, context.get("draft"), context.get("value"))

  return {
    apply() {
      send({type: "APPLY"})
    },
    applyMode,
    clearAll() {
      send({type: "CLEAR_ALL"})
    },
    filterCount,
    filters,
    getFilterLabel(id) {
      return prop("getFilterLabel")?.(id) || id
    },
    getFilterOptionLabel(id, value) {
      return (
        prop("getFilterOptionLabel")?.(id, value) ?? stringifyFilterValue(value)
      )
    },
    getFilterValue(id) {
      return getFilterValue(filters, id)
    },
    isDirty,
    reset() {
      send({type: "RESET"})
    },
    setFilterValue(id, value, filterType) {
      send({filterType, id, type: "FILTER.SET", value})
    },

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
      const disabled = filterCount === 0
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
    getRootBindings(): FilterPanelRootBindings {
      return normalize.element({
        ...parts.root,
        "data-apply-mode": applyMode,
        "data-dirty": booleanDataAttr(isDirty),
      })
    },
  }
}
