// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import {
  areFiltersEqual,
  countFilters,
  findColumn,
  getFilterValue,
  stringifyFilterValue,
} from "./internal/table-filter-panel.utils.js"
import {tableFilterPanelAnatomy} from "./table-filter-panel.anatomy.js"
import type {
  TableFilterPanelApi,
  TableFilterPanelApplyTriggerBindings,
  TableFilterPanelClearTriggerBindings,
  TableFilterPanelRootBindings,
  TableFilterPanelSchema,
} from "./table-filter-panel.types.js"

const parts = tableFilterPanelAnatomy.parts

export function createTableFilterPanelApi(
  machine: Machine<TableFilterPanelSchema>,
  normalize: PropNormalizer,
): TableFilterPanelApi {
  const {computed, context, prop, refs, send} = machine
  const table = prop("table")
  const applyMode = prop("applyMode")
  const filters = computed("filters")
  const filterCount = countFilters(table, filters)
  const isDirty =
    applyMode === "manual" &&
    !areFiltersEqual(
      table,
      context.get("draft"),
      table.getState().columnFilters,
    )

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
      return (
        refs.get("registry").get(id)?.label ||
        findColumn(table, id)?.getFilterLabel() ||
        id
      )
    },
    getFilterOptionLabel(id, value) {
      const getOptionLabel = refs.get("registry").get(id)?.getOptionLabel
      if (getOptionLabel) {
        return getOptionLabel(value)
      }
      const column = findColumn(table, id)
      if (column) {
        return column.getFilterOptionLabel(value)
      }
      return stringifyFilterValue(value)
    },
    getFilterValue(id) {
      return getFilterValue(filters, id)
    },
    isDirty,
    registerFilter(filter) {
      send({filter, type: "FILTER.REGISTER"})
    },
    reset() {
      send({type: "RESET"})
    },
    setFilterValue(id, value) {
      send({id, type: "FILTER.SET", value})
    },
    unregisterFilter(id) {
      send({id, type: "FILTER.UNREGISTER"})
    },

    // group: bindings
    getApplyTriggerBindings(): TableFilterPanelApplyTriggerBindings {
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
    getClearTriggerBindings(): TableFilterPanelClearTriggerBindings {
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
    getRootBindings(): TableFilterPanelRootBindings {
      return normalize.element({
        ...parts.root,
        "data-apply-mode": applyMode,
        "data-dirty": booleanDataAttr(isDirty),
      })
    },
  }
}
