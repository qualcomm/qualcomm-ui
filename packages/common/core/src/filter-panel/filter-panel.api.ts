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
  FilterPanelCountBindings,
  FilterPanelFilterBindings,
  FilterPanelFilterCountBindings,
  FilterPanelFilterIndicatorBindings,
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
    getCountBindings(): FilterPanelCountBindings {
      return normalize.element({
        ...parts.count,
        "aria-label": `${draftValueCount} selected`,
        hidden: draftValueCount === 0,
      })
    },
    getFilterBindings({id, isActive}): FilterPanelFilterBindings {
      return normalize.element({
        ...parts.filter,
        "data-active": booleanDataAttr(isActive),
        "data-filter-id": id,
      })
    },
    getFilterCountBindings({count}): FilterPanelFilterCountBindings {
      return normalize.element({
        ...parts.filterCount,
        "aria-label": `${count} selected`,
        hidden: count === 0,
      })
    },
    getFilterIndicatorBindings({open}): FilterPanelFilterIndicatorBindings {
      return normalize.element({
        ...parts.filterIndicator,
        "aria-hidden": true,
        "data-state": open ? "open" : "closed",
      })
    },
    getFilterLabelBindings({
      isActive,
      labelId,
    }): FilterPanelFilterLabelBindings {
      return normalize.element({
        ...parts.filterLabel,
        "data-active": booleanDataAttr(isActive),
        id: labelId,
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
