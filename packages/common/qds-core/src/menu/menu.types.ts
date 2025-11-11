// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {checkboxClasses} from "@qualcomm-ui/qds-core/checkbox"
import type {radioClasses} from "@qualcomm-ui/qds-core/radio"

import type {menuItemClasses} from "./menu-item.classes"
import type {menuClasses} from "./menu.classes"

type MenuItemClasses = typeof menuItemClasses
type MenuClasses = typeof menuClasses

export type QdsMenuSize = "sm" | "md"

export interface QdsMenuApiProps {
  size?: QdsMenuSize
}

export interface QdsMenuContentBindings {
  className: MenuClasses["content"]
  "data-size": QdsMenuSize
}

export interface QdsMenuItemBindings {
  className: MenuItemClasses["root"]
  "data-size": QdsMenuSize
}

export interface QdsMenuItemCommandBindings {
  className: MenuItemClasses["command"]
  "data-size": QdsMenuSize
}

export interface QdsMenuItemStartIconBindings {
  className: MenuItemClasses["startIcon"]
  "data-part": "start-icon"
  "data-size": QdsMenuSize
}

export interface QdsMenuSeparatorBindings {
  className: MenuClasses["separator"]
}

export interface QdsMenuItemGroupBindings {
  className: MenuItemClasses["group"]
}

export interface QdsMenuItemGroupLabelBindings {
  className: MenuItemClasses["groupLabel"]
  "data-size": QdsMenuSize
}

export interface QdsMenuRadioItemBindings {
  className: MenuItemClasses["root"]
  "data-size": QdsMenuSize
}

export interface QdsMenuRadioItemControlBindings {
  className: (typeof radioClasses)["itemControl"]
}

export interface QdsMenuItemLabelBindings {
  className: MenuItemClasses["itemLabel"]
  "data-size": QdsMenuSize
}

export interface QdsMenuDescriptionBindings {
  className: MenuItemClasses["itemDescription"]
  "data-part": "description"
  "data-scope": "menu"
  "data-size": QdsMenuSize
}

export interface QdsMenuItemIndicatorBindings {
  className: MenuItemClasses["itemIndicator"]
  "data-size": QdsMenuSize
}

export interface QdsMenuCheckboxItemControlBindings {
  className: (typeof checkboxClasses)["control"]
}

export interface QdsMenuItemAccessoryBindings {
  className: MenuItemClasses["itemAccessory"]
}

export interface QdsMenuTriggerItemIndicatorBindings {
  className: MenuItemClasses["itemIndicator"]
}

export interface QdsMenuButtonBindings {
  className: MenuClasses["button"]
}

export interface QdsMenuApi {
  size: QdsMenuSize

  // group: bindings
  getButtonBindings(): QdsMenuButtonBindings
  getCheckboxItemControlBindings(): QdsMenuCheckboxItemControlBindings
  getContentBindings(): QdsMenuContentBindings
  getItemBindings(): QdsMenuItemBindings
  getItemCommandBindings(): QdsMenuItemCommandBindings
  getItemGroupBindings(): QdsMenuItemGroupBindings
  getItemGroupLabelBindings(): QdsMenuItemGroupLabelBindings
  getItemIndicatorBindings(): QdsMenuItemIndicatorBindings
  getItemLabelBindings(): QdsMenuItemLabelBindings
  getItemStartIconBindings(): QdsMenuItemStartIconBindings
  getMenuItemAccessoryBindings(): QdsMenuItemAccessoryBindings
  getMenuItemDescriptionBindings(): QdsMenuDescriptionBindings
  getRadioItemBindings(): QdsMenuRadioItemBindings
  getRadioItemControlBindings(): QdsMenuRadioItemControlBindings
  getSeparatorBindings(): QdsMenuSeparatorBindings
  getTriggerItemIndicatorBindings(): QdsMenuTriggerItemIndicatorBindings
}
