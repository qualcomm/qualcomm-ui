// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FilterSetApi} from "@qualcomm-ui/core/filter-set"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {filterPanelAnatomy} from "./filter-panel.anatomy.js"
import type {
  FilterPanelApi,
  FilterPanelApplyTriggerBindings,
  FilterPanelClearTriggerBindings,
  FilterPanelFilterBindings,
  FilterPanelFilterCountBindings,
  FilterPanelFilterLabelBindings,
  FilterPanelRootBindings,
} from "./filter-panel.types.js"

const parts = filterPanelAnatomy.parts

export function createFilterPanelApi(
  filterSet: FilterSetApi<any>,
  normalize: PropNormalizer,
): FilterPanelApi {
  const {applyMode, draftValueCount, isDirty} = filterSet

  return {
    getApplyTriggerBindings(): FilterPanelApplyTriggerBindings {
      return normalize.button({
        ...parts.applyTrigger,
        "data-disabled": booleanDataAttr(!isDirty),
        disabled: !isDirty,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          filterSet.apply()
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
          filterSet.clearDraftValue()
        },
        type: "button",
      })
    },
    getFilterBindings({id}): FilterPanelFilterBindings {
      return normalize.element({
        ...parts.filter,
        "data-active": booleanDataAttr(filterSet.hasDraftValue(id)),
        "data-filter-id": id,
      })
    },
    getFilterCountBindings({id}): FilterPanelFilterCountBindings {
      const count = filterSet.getDraftValueCount(id)
      return normalize.element({
        ...parts.filterCount,
        "aria-label": `${count} selected`,
        hidden: count === 0,
      })
    },
    getFilterLabelBindings({id}): FilterPanelFilterLabelBindings {
      return normalize.element({
        ...parts.filterLabel,
        "data-active": booleanDataAttr(filterSet.hasDraftValue(id)),
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
