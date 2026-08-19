// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {qdsListItemAnatomy} from "./list-item.anatomy.js"
import type {listItemClasses} from "./list-item.classes.js"

type ListItemClasses = typeof listItemClasses

export type QdsListItemSize = "sm" | "md" | "lg"

type PartName = AnatomyPartName<typeof qdsListItemAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"list-item", P> {}

export interface QdsListItemApiProps {
  /**
   * Applies only to interactive list items.
   */
  disabled?: boolean

  /**
   * Applies an interactive style to the list item to indicate that it is selectable.
   */
  interactive?: boolean

  /**
   * Governs list-item font size, padding, spacing, and icon sizes.
   *
   * @default 'md'
   */
  size?: QdsListItemSize
}

export interface QdsListItemRootBindings extends Part<"root"> {
  className: ListItemClasses["root"]
  "data-disabled": BooleanDataAttr
  "data-interactive": BooleanDataAttr
  "data-size": QdsListItemSize
}

export interface QdsListItemLabelBindings extends Part<"label"> {
  className: ListItemClasses["label"]
  "data-disabled": BooleanDataAttr
  "data-size": QdsListItemSize
}

export interface QdsListItemDescriptionBindings extends Part<"description"> {
  className: ListItemClasses["description"]
  "data-disabled": BooleanDataAttr
}

export interface QdsListItemSecondaryTextBindings extends Part<"secondaryText"> {
  className: ListItemClasses["secondaryText"]
  "data-disabled": BooleanDataAttr
}

export interface QdsListItemStartIconBindings extends Part<"startIcon"> {
  className: ListItemClasses["startIcon"]
  "data-disabled": BooleanDataAttr
  "data-size": QdsListItemSize
}

export interface QdsListItemControlBindings extends Part<"control"> {
  className: ListItemClasses["control"]
  "data-disabled": BooleanDataAttr
  "data-size": QdsListItemSize
}

export interface QdsListItemAccessoryBindings extends Part<"accessory"> {
  className: ListItemClasses["accessory"]
  "data-disabled": BooleanDataAttr
  "data-size": QdsListItemSize
}

export interface QdsListItemApi {
  disabled: boolean
  interactive: boolean
  size: QdsListItemSize

  // group: bindings
  getAccessoryBindings(): QdsListItemAccessoryBindings
  getControlBindings(): QdsListItemControlBindings
  getDescriptionBindings(): QdsListItemDescriptionBindings
  getLabelBindings(): QdsListItemLabelBindings
  getRootBindings(): QdsListItemRootBindings
  getSecondaryTextBindings(): QdsListItemSecondaryTextBindings
  getStartIconBindings(): QdsListItemStartIconBindings
}
