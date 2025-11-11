// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {inputClasses} from "@qualcomm-ui/qds-core/input"

import type {checkboxClasses} from "./checkbox.classes"

export type QdsCheckboxSize = "sm" | "md" | "lg"

export interface QdsCheckboxApiProps {
  /**
   * The size of the checkbox and its elements. Governs properties like label font
   * size, control size, and indicator size.
   * @default 'md'
   */
  size?: QdsCheckboxSize
}

type CheckboxClasses = typeof checkboxClasses
type InputClasses = typeof inputClasses

export interface QdsCheckboxRootBindings {
  className: CheckboxClasses["root"]
}

export interface QdsCheckboxLabelBindings {
  className: CheckboxClasses["label"]
  "data-size": QdsCheckboxSize
}

export interface QdsCheckboxControlBindings {
  className: CheckboxClasses["control"]
  "data-size": QdsCheckboxSize
}

export interface QdsCheckboxIndicatorBindings {
  className: CheckboxClasses["indicator"]
  "data-size": QdsCheckboxSize
}

export interface QdsCheckboxErrorTextBindings {
  className: InputClasses["errorText"]
}

export interface QdsCheckboxHiddenInputBindings {
  className: CheckboxClasses["hiddenInput"]
}

export interface QdsCheckboxApi {
  size: QdsCheckboxSize

  // group: bindings
  getControlBindings(): QdsCheckboxControlBindings
  getErrorTextBindings(): QdsCheckboxErrorTextBindings
  getHiddenInputBindings(): QdsCheckboxHiddenInputBindings
  getIndicatorBindings(): QdsCheckboxIndicatorBindings
  getLabelBindings(): QdsCheckboxLabelBindings
  getRootBindings(): QdsCheckboxRootBindings
}
