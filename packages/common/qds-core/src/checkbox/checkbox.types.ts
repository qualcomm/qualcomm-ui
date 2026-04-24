// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {checkboxAnatomy} from "@qualcomm-ui/core/checkbox"
import type {inputClasses} from "@qualcomm-ui/qds-core/input"
import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"

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

type PartName = AnatomyPartName<typeof checkboxAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"checkbox", P> {}

export interface QdsCheckboxRootBindings extends Part<"root"> {
  className: CheckboxClasses["root"]
}

export interface QdsCheckboxLabelBindings extends Part<"label"> {
  className: CheckboxClasses["label"]
  "data-size": QdsCheckboxSize
}

export interface QdsCheckboxControlBindings extends Part<"control"> {
  className: CheckboxClasses["control"]
  "data-size": QdsCheckboxSize
}

export interface QdsCheckboxIndicatorBindings extends Part<"indicator"> {
  className: CheckboxClasses["indicator"]
  "data-size": QdsCheckboxSize
}

export interface QdsCheckboxErrorTextBindings extends Part<"errorText"> {
  className: InputClasses["errorText"]
}

export interface QdsCheckboxHintBindings extends Part<"hint"> {
  className: InputClasses["hint"]
}

export interface QdsCheckboxHiddenInputBindings extends Part<"hiddenInput"> {
  className: CheckboxClasses["hiddenInput"]
}

export interface QdsCheckboxApi {
  size: QdsCheckboxSize

  // group: bindings
  getControlBindings(): QdsCheckboxControlBindings
  getErrorTextBindings(): QdsCheckboxErrorTextBindings
  getHiddenInputBindings(): QdsCheckboxHiddenInputBindings
  getHintBindings(): QdsCheckboxHintBindings
  getIndicatorBindings(): QdsCheckboxIndicatorBindings
  getLabelBindings(): QdsCheckboxLabelBindings
  getRootBindings(): QdsCheckboxRootBindings
}
