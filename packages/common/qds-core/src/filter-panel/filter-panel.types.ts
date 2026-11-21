// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsNumberBadgeProps} from "@qualcomm-ui/qds-core/badge"
import type {QdsButtonApiProps} from "@qualcomm-ui/qds-core/button"
import type {QdsFilterControlApiProps} from "@qualcomm-ui/qds-core/filter-control"
import type {QdsIconApiProps} from "@qualcomm-ui/qds-core/icon"

import type {filterPanelClasses} from "./filter-panel.classes.js"

type FilterPanelClasses = typeof filterPanelClasses

export type QdsFilterPanelSize = "sm" | "md" | "lg"

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

export interface QdsFilterPanelApplyButtonBindings {
  className: FilterPanelClasses["applyButton"]
}

export interface QdsFilterPanelClearButtonBindings {
  className: FilterPanelClasses["clearButton"]
}

export interface QdsFilterPanelCloseButtonBindings {
  "aria-label": string
  className: FilterPanelClasses["closeButton"]
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

export interface QdsFilterPanelSectionBindings {
  className: FilterPanelClasses["section"]
}

export interface QdsFilterPanelApi {
  getApplyButtonProps(): QdsButtonApiProps
  getButtonProps(): QdsButtonApiProps
  getCountBadgeProps(): QdsNumberBadgeProps
  getFilterControlProps(): QdsFilterControlApiProps
  getFilterCountBadgeProps(): QdsNumberBadgeProps
  getIconProps(): QdsIconApiProps

  size: QdsFilterPanelSize

  // group: bindings
  getApplyButtonBindings(): QdsFilterPanelApplyButtonBindings
  getClearButtonBindings(): QdsFilterPanelClearButtonBindings
  getCloseButtonBindings(): QdsFilterPanelCloseButtonBindings
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
  getRootBindings(): QdsFilterPanelRootBindings
  getSectionBindings(): QdsFilterPanelSectionBindings
}
