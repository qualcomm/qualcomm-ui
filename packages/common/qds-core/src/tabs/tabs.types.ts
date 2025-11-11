// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {tabClasses, tabsClasses} from "./tabs.classes"

export type QdsTabsSize = "sm" | "md" | "lg" | "xl"

export type QdsTabsVariant = "line" | "contained"

export type QdsTabsIconVariant = "ghost" | "filled"

export interface QdsTabsApiProps {
  /**
   * If true, the indicator's position change will animate when the active tab
   * changes. Only applies to the `line` variant.
   *
   * @default true
   */
  animateIndicator?: boolean

  /**
   * The visual style of tab icons.
   * @option `'ghost'`: The icon is rendered with a transparent background.
   * @option `'filled'`: The icon is rendered with a solid background.
   * @default 'ghost'
   */
  iconVariant?: QdsTabsIconVariant

  /**
   * Governs the size of the tab text, icons, spacing, and padding. Note that `lg`
   * and `xl` are not supported by the contained {@link variant}.
   *
   * @default 'md'
   */
  size?: QdsTabsSize

  /**
   * Governs the appearance of the tab.
   * @option `'line'`: active tab items have a line underneath them.
   * @option `'contained'`: active tab items have a box-like appearance.
   */
  variant?: QdsTabsVariant
}

type TabsClasses = typeof tabsClasses
type TabClasses = typeof tabClasses

export interface QdsTabsRootBindings {
  className: TabsClasses["root"]
  "data-size": QdsTabsSize
}

export interface QdsTabsTabBindings {
  className: TabClasses["root"]
  "data-size": QdsTabsSize
  "data-variant": QdsTabsVariant
}

export interface QdsTabsTabButtonBindings {
  className: TabClasses["button"]
  "data-size": QdsTabsSize
  "data-variant": QdsTabsVariant
}

export interface QdsTabsIndicatorBindings {
  className: TabsClasses["indicator"]
  "data-animate": BooleanDataAttr
  "data-size": QdsTabsSize
  "data-variant": QdsTabsVariant
  /** Hidden for `contained` variant. */
  hidden: boolean
}

export interface QdsTabsPanelBindings {
  className: TabsClasses["panel"]
}

export interface QdsTabsListBindings {
  className: TabsClasses["list"]
  "data-size": QdsTabsSize
  "data-variant": QdsTabsVariant
}

export interface QdsTabsTabStartIconBindings {
  className: TabClasses["icon"]
  "data-icon-variant": QdsTabsIconVariant
  "data-placement": "start"
  "data-size": QdsTabsSize
  "data-variant": QdsTabsVariant
}

export interface QdsTabsTabEndIconBindings {
  className: TabClasses["icon"]
  "data-icon-variant": QdsTabsIconVariant
  "data-placement": "end"
  "data-size": QdsTabsSize
  "data-variant": QdsTabsVariant
}

export interface QdsTabsTabDismissButtonBindings {
  className: TabClasses["dismissButton"]
  "data-size": QdsTabsSize
}

export interface QdsTabsApi {
  size: QdsTabsSize
  variant: QdsTabsVariant

  // group: bindings
  getIndicatorBindings(): QdsTabsIndicatorBindings
  getListBindings(): QdsTabsListBindings
  getPanelBindings(): QdsTabsPanelBindings
  getRootBindings(): QdsTabsRootBindings
  getTabBindings(): QdsTabsTabBindings
  getTabButtonBindings(): QdsTabsTabButtonBindings
  getTabDismissButtonBindings(): QdsTabsTabDismissButtonBindings
  getTabEndIconBindings(): QdsTabsTabEndIconBindings
  getTabStartIconBindings(): QdsTabsTabStartIconBindings
}
