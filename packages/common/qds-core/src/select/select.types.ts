// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {selectClasses} from "./select.classes.js"

export type QdsSelectSize = "sm" | "md" | "lg"

export type QdsSelectSelectionIndicator = "checkmark" | "checkbox"

export interface QdsSelectApiProps {
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

export interface QdsSelectItemGroupBindings {
  className: SelectClasses["itemGroup"]
  "data-size": QdsSelectSize
}

export interface QdsSelectItemGroupLabelBindings {
  className: SelectClasses["itemGroupLabel"]
  "data-size": QdsSelectSize
}

export interface QdsSelectApi {
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
  getItemGroupBindings(): QdsSelectItemGroupBindings
  getItemGroupLabelBindings(): QdsSelectItemGroupLabelBindings
  getItemIndicatorBindings(): QdsSelectItemIndicatorBindings
  getItemTextBindings(): QdsSelectItemTextBindings
  getLabelBindings(): QdsSelectLabelBindings
  getPositionerBindings(): QdsSelectPositionerBindings
  getRootBindings(): QdsSelectRootBindings
  getValueTextBindings(): QdsSelectValueTextBindings
}
