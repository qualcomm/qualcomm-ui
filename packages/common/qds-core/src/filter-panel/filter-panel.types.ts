// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsButtonApiProps} from "@qualcomm-ui/qds-core/button"

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

export interface QdsFilterPanelClearTriggerBindings {
  className: FilterPanelClasses["clearTrigger"]
}

export interface QdsFilterPanelCloseTriggerBindings {
  "aria-label": string
  className: FilterPanelClasses["closeTrigger"]
  type: "button"
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
  getButtonProps(): QdsButtonApiProps

  size: QdsFilterPanelSize

  // group: bindings
  getClearTriggerBindings(): QdsFilterPanelClearTriggerBindings
  getCloseTriggerBindings(): QdsFilterPanelCloseTriggerBindings
  getHeaderBindings(): QdsFilterPanelHeaderBindings
  getHeadingBindings(): QdsFilterPanelHeadingBindings
  getRootBindings(): QdsFilterPanelRootBindings
  getSectionBindings(): QdsFilterPanelSectionBindings
}
