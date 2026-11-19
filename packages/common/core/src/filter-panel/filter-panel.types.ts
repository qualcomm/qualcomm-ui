// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FilterSetApplyMode} from "@qualcomm-ui/core/filter-set"
import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {JSX} from "@qualcomm-ui/utils/machine"

import type {filterPanelAnatomy} from "./filter-panel.anatomy.js"

type PartName = AnatomyPartName<typeof filterPanelAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"filter-panel", P> {}

export interface FilterPanelRootBindings extends Part<"root"> {
  "data-apply-mode": FilterSetApplyMode
  "data-dirty": BooleanDataAttr
}

export interface FilterPanelApplyTriggerBindings extends Part<"applyTrigger"> {
  "data-disabled": BooleanDataAttr
  disabled: boolean
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface FilterPanelClearTriggerBindings extends Part<"clearTrigger"> {
  "data-disabled": BooleanDataAttr
  disabled: boolean
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface FilterPanelFilterBindingsProps {
  /**
   * The filter id.
   */
  id: string
}

export interface FilterPanelFilterBindings extends Part<"filter"> {
  "data-active": BooleanDataAttr
  "data-filter-id": string
}

export interface FilterPanelFilterLabelBindings extends Part<"filterLabel"> {
  "data-active": BooleanDataAttr
}

export interface FilterPanelFilterCountBindings extends Part<"filterCount"> {
  "aria-label": string
  hidden: boolean
}

/**
 * Element bindings for the filter panel, derived from a filter set.
 */
export interface FilterPanelApi {
  getApplyTriggerBindings: () => FilterPanelApplyTriggerBindings
  getClearTriggerBindings: () => FilterPanelClearTriggerBindings
  getFilterBindings: (
    props: FilterPanelFilterBindingsProps,
  ) => FilterPanelFilterBindings
  getFilterCountBindings: (
    props: FilterPanelFilterBindingsProps,
  ) => FilterPanelFilterCountBindings
  getFilterLabelBindings: (
    props: FilterPanelFilterBindingsProps,
  ) => FilterPanelFilterLabelBindings
  getRootBindings: () => FilterPanelRootBindings
}
