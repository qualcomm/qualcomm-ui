// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsNumberBadgeProps} from "@qualcomm-ui/qds-core/badge"
import type {QdsButtonApiProps} from "@qualcomm-ui/qds-core/button"
import type {QdsIconApiProps} from "@qualcomm-ui/qds-core/icon"

import type {filterPanelClasses} from "./filter-panel.classes.js"

type FilterPanelClasses = typeof filterPanelClasses

export type QdsFilterPanelSize = "sm" | "md" | "lg"

/**
 * The size applied to controls inside filters. Every QDS form control
 * supports these sizes.
 */
export type QdsFilterPanelControlSize = "sm" | "md"

export interface QdsFilterPanelApiProps {
  /**
   * The size of the filter panel and its controls.
   *
   * @default "md"
   */
  size?: QdsFilterPanelSize | undefined
}

export interface QdsFilterPanelRootBindings {
  className: FilterPanelClasses["root"]
  "data-size": QdsFilterPanelSize
}

export interface QdsFilterPanelApplyTriggerBindings {
  className: FilterPanelClasses["applyTrigger"]
}

export interface QdsFilterPanelClearTriggerBindings {
  className: FilterPanelClasses["clearTrigger"]
}

export interface QdsFilterPanelCloseTriggerBindings {
  "aria-label": string
  className: FilterPanelClasses["closeTrigger"]
  type: "button"
}

export interface QdsFilterPanelCountBindings {
  className: FilterPanelClasses["count"]
}

export interface QdsFilterPanelFilterBindings {
  className: FilterPanelClasses["filter"]
}

export interface QdsFilterPanelFilterContentBindings {
  className: FilterPanelClasses["filterContent"]
}

export interface QdsFilterPanelFilterCountBindings {
  className: FilterPanelClasses["filterCount"]
}

export interface QdsFilterPanelFilterIndicatorBindings {
  className: FilterPanelClasses["filterIndicator"]
}

export interface QdsFilterPanelFilterLabelBindings {
  className: FilterPanelClasses["filterLabel"]
}

export interface QdsFilterPanelFilterTriggerBindings {
  className: FilterPanelClasses["filterTrigger"]
}

export interface QdsFilterPanelFooterBindings {
  className: FilterPanelClasses["footer"]
}

export interface QdsFilterPanelHeaderBindings {
  className: FilterPanelClasses["header"]
}

export interface QdsFilterPanelHeadingBindings {
  className: FilterPanelClasses["heading"]
}

export interface QdsFilterPanelOptionGroupBindings {
  className: FilterPanelClasses["optionGroup"]
}

export interface QdsFilterPanelSectionBindings {
  className: FilterPanelClasses["section"]
}

export interface QdsFilterPanelApi {
  /**
   * The size applied to controls inside filters.
   */
  controlSize: QdsFilterPanelControlSize

  getApplyTriggerButtonProps(): QdsButtonApiProps
  getButtonProps(): QdsButtonApiProps
  getCountBadgeProps(): QdsNumberBadgeProps
  getFilterCountBadgeProps(): QdsNumberBadgeProps
  getFilterIndicatorIconProps(): QdsIconApiProps

  size: QdsFilterPanelSize

  // group: bindings
  getApplyTriggerBindings(): QdsFilterPanelApplyTriggerBindings
  getClearTriggerBindings(): QdsFilterPanelClearTriggerBindings
  getCloseTriggerBindings(): QdsFilterPanelCloseTriggerBindings
  getCountBindings(): QdsFilterPanelCountBindings
  getFilterBindings(): QdsFilterPanelFilterBindings
  getFilterContentBindings(): QdsFilterPanelFilterContentBindings
  getFilterCountBindings(): QdsFilterPanelFilterCountBindings
  getFilterIndicatorBindings(): QdsFilterPanelFilterIndicatorBindings
  getFilterLabelBindings(): QdsFilterPanelFilterLabelBindings
  getFilterTriggerBindings(): QdsFilterPanelFilterTriggerBindings
  getFooterBindings(): QdsFilterPanelFooterBindings
  getHeaderBindings(): QdsFilterPanelHeaderBindings
  getHeadingBindings(): QdsFilterPanelHeadingBindings
  getOptionGroupBindings(): QdsFilterPanelOptionGroupBindings
  getRootBindings(): QdsFilterPanelRootBindings
  getSectionBindings(): QdsFilterPanelSectionBindings
}
