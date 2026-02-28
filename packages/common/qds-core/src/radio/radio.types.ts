// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {inputClasses} from "@qualcomm-ui/qds-core/input"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {radioClasses} from "./radio.classes"

export type QdsRadioSize = "sm" | "md" | "lg"

export interface QdsRadioApiProps {
  /**
   * Indents the radio items. Only used at radio group level.
   * @default false
   */
  indented?: boolean
  /**
   * The size of the radio and its elements. Governs properties like label font
   * size, control size, and indicator size.
   * @default 'md'
   */
  size?: QdsRadioSize
}

type RadioClasses = typeof radioClasses
type InputClasses = typeof inputClasses

export interface QdsRadioItemBindings {
  className: RadioClasses["item"]
}

export interface QdsRadioItemLabelBindings {
  className: RadioClasses["itemLabel"]
  "data-size": QdsRadioSize
}

export interface QdsRadioItemControlBindings {
  className: RadioClasses["itemControl"]
  "data-size": QdsRadioSize
}

export interface QdsRadioItemHiddenInputBindings {
  className: RadioClasses["itemHiddenInput"]
}

export interface QdsRadioGroupErrorTextBindings {
  className: InputClasses["errorText"]
}

export interface QdsRadioGroupHintBindings {
  className: InputClasses["hint"]
}

export interface QdsRadioItemHintBindings {
  className: InputClasses["hint"]
}

export interface QdsRadioGroupBindings {
  className: RadioClasses["group"]
}

export interface QdsRadioGroupLabelBindings {
  className: RadioClasses["groupLabel"]
  "data-size": QdsRadioSize
}

export interface QdsRadioGroupItemsBindings {
  className: RadioClasses["items"]
  "data-indented"?: BooleanDataAttr
  "data-size": QdsRadioSize
}

export interface QdsRadioApi {
  size: QdsRadioSize

  // group: bindings
  getGroupBindings(): QdsRadioGroupBindings
  getGroupErrorTextBindings(): QdsRadioGroupErrorTextBindings
  getGroupHintBindings(): QdsRadioGroupHintBindings
  getGroupItemsBindings(): QdsRadioGroupItemsBindings
  getGroupLabelBindings(): QdsRadioGroupLabelBindings
  getItemBindings(): QdsRadioItemBindings
  getItemControlBindings(): QdsRadioItemControlBindings
  getItemHiddenInputBindings(): QdsRadioItemHiddenInputBindings
  getItemHintBindings(): QdsRadioItemHintBindings
  getItemLabelBindings(): QdsRadioItemLabelBindings
}
