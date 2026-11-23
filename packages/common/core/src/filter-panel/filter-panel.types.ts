// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  FilterSetApplyMode,
  FilterState,
} from "@qualcomm-ui/core/filter-set"
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

export interface FilterPanelCountBindings extends Part<"count"> {
  "aria-label": string
  hidden: boolean
}

/**
 * The state of the filter that a filter part belongs to.
 */
export type FilterPanelFilterBindingsProps = Pick<
  FilterState,
  "count" | "id" | "isActive" | "labelId"
>

export interface FilterPanelFilterBindings extends Part<"filter"> {
  "data-active": BooleanDataAttr
  "data-filter-id": string
}

export interface FilterPanelFilterLabelBindings extends Part<"filterLabel"> {
  "data-active": BooleanDataAttr
  id: string | undefined
}

export interface FilterPanelFilterCountBindings extends Part<"filterCount"> {
  "aria-label": string
  hidden: boolean
}

export interface FilterPanelFilterIndicatorBindingsProps {
  /**
   * Whether the filter's content is expanded.
   */
  open: boolean
}

export interface FilterPanelFilterIndicatorBindings extends Part<"filterIndicator"> {
  "aria-hidden": true
  "data-state": "open" | "closed"
}

/**
 * Element bindings for the filter panel, derived from a filter set.
 */
export interface FilterPanelApi {
  getApplyTriggerBindings: () => FilterPanelApplyTriggerBindings
  getClearTriggerBindings: () => FilterPanelClearTriggerBindings
  getCountBindings: () => FilterPanelCountBindings
  getFilterBindings: (
    props: FilterPanelFilterBindingsProps,
  ) => FilterPanelFilterBindings
  getFilterCountBindings: (
    props: FilterPanelFilterBindingsProps,
  ) => FilterPanelFilterCountBindings
  getFilterIndicatorBindings: (
    props: FilterPanelFilterIndicatorBindingsProps,
  ) => FilterPanelFilterIndicatorBindings
  getFilterLabelBindings: (
    props: FilterPanelFilterBindingsProps,
  ) => FilterPanelFilterLabelBindings
  getRootBindings: () => FilterPanelRootBindings
}
