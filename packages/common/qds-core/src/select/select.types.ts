// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {selectClasses} from "./select.classes"

export type QdsSelectSize = "sm" | "md" | "lg"

export type QdsSelectSelectionIndicator = "checkmark" | "checkbox"

export type QdsSelectMaxTagCount = "responsive" | number

export interface QdsSelectApiProps {
  /**
   * Maximum number of tags to display in multiple selection mode.
   * When set, tags display in a single line without wrapping.
   * - `'responsive'`: Auto-detect overflow and show "+N" indicator
   * - `number`: Show at most N tags, with "+N" indicator for the rest
   * - `0`: Show only the overflow indicator with total count (no individual tags)
   * - `undefined`: Show all tags with wrapping (default behavior)
   */
  maxTagCount?: QdsSelectMaxTagCount
  /**
   * Visual indicator style for selected items. Use "checkbox" for multi-select
   * with always-visible checkboxes on the left, or "checkmark" for a checkmark
   * icon on the right that only appears when selected.
   *
   * @default 'checkmark'
   */
  selectionIndicator?: QdsSelectSelectionIndicator
  /**
   * The size of the select and its elements. Governs properties like font size,
   * item padding, and icon sizes.
   *
   * @default 'md'
   */
  size?: QdsSelectSize
}

type SelectClasses = typeof selectClasses

export interface QdsSelectRootBindings {
  className: SelectClasses["root"]
  "data-size": QdsSelectSize
}

export interface QdsSelectLabelBindings {
  className: SelectClasses["label"]
}

export interface QdsSelectControlBindings {
  className: SelectClasses["control"]
  "data-size": QdsSelectSize
}

export interface QdsSelectIndicatorBindings {
  className: SelectClasses["indicator"]
  "data-size": QdsSelectSize
}

export interface QdsSelectItemBindings {
  className: SelectClasses["item"]
  "data-selection-indicator": QdsSelectSelectionIndicator
  "data-size": QdsSelectSize
}

export interface QdsSelectItemTextBindings {
  className: SelectClasses["itemText"]
}

export interface QdsSelectItemIndicatorBindings {
  className: SelectClasses["itemIndicator"]
}

export interface QdsSelectClearTriggerBindings {
  className: SelectClasses["clearTrigger"]
  "data-size": QdsSelectSize
}

export interface QdsSelectValueTextBindings {
  className: SelectClasses["valueText"]
  "data-size": QdsSelectSize
}

export interface QdsSelectContentBindings {
  className: SelectClasses["content"]
}

export interface QdsSelectHiddenSelectBindings {
  className: SelectClasses["hiddenSelect"]
}

export interface QdsSelectPositionerBindings {
  className: SelectClasses["positioner"]
}

export interface QdsSelectIconBindings {
  className: SelectClasses["icon"]
  "data-size": QdsSelectSize
}

export interface QdsSelectOverflowIndicatorBindings {
  className: SelectClasses["overflowIndicator"]
}

export interface QdsSelectApi {
  maxTagCount: QdsSelectMaxTagCount | undefined
  selectionIndicator: QdsSelectSelectionIndicator
  size: QdsSelectSize

  // group: bindings
  getClearTriggerBindings(): QdsSelectClearTriggerBindings
  getContentBindings(): QdsSelectContentBindings
  getControlBindings(): QdsSelectControlBindings
  getHiddenSelectBindings(): QdsSelectHiddenSelectBindings
  getIconBindings(): QdsSelectIconBindings
  getIndicatorBindings(): QdsSelectIndicatorBindings
  getItemBindings(): QdsSelectItemBindings
  getItemIndicatorBindings(): QdsSelectItemIndicatorBindings
  getItemTextBindings(): QdsSelectItemTextBindings
  getLabelBindings(): QdsSelectLabelBindings
  getOverflowIndicatorBindings(): QdsSelectOverflowIndicatorBindings
  getPositionerBindings(): QdsSelectPositionerBindings
  getRootBindings(): QdsSelectRootBindings
  getValueTextBindings(): QdsSelectValueTextBindings
}
