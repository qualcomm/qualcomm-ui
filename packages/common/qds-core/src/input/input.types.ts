// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {inputClasses} from "./input.classes"

export type QdsInputSize = "sm" | "md" | "lg"

export interface QdsInputApiProps<IconType> {
  /**
   * {@link https://lucide.dev lucide} icon, positioned at the end of the
   * input field.
   */
  endIcon?: IconType

  /**
   * The size of the input field and its elements. Governs properties like font size,
   * item padding, and icon sizes.
   *
   * @default 'md'
   */
  size?: QdsInputSize

  /**
   * {@link https://lucide.dev lucide} icon, positioned at the start of the
   * input field.
   */
  startIcon?: IconType
}

type InputClasses = typeof inputClasses

export interface QdsInputInputBindings {
  className: InputClasses["input"]
  "data-size": QdsInputSize
}

export interface QdsInputRootBindings {
  className: InputClasses["root"]
  "data-size": QdsInputSize
}

export interface QdsInputLabelBindings {
  className: InputClasses["label"]
  "data-size": QdsInputSize
}

export interface QdsInputErrorTextBindings {
  className: InputClasses["errorText"]
}

export interface QdsInputGroupBindings {
  className: InputClasses["group"]
  "data-size": QdsInputSize
}

export interface QdsInputHintBindings {
  className: InputClasses["hint"]
}

export interface QdsInputClearTriggerBindings {
  className: InputClasses["clearTrigger"]
  "data-size": QdsInputSize
}

export interface QdsInputStartIconBindings {
  className: InputClasses["icon"]
  "data-part": "start-icon"
  "data-size": QdsInputSize
}

export interface QdsInputEndIconBindings {
  className: InputClasses["icon"]
  "data-part": "end-icon"
  "data-size": QdsInputSize
}

export interface QdsInputErrorIndicatorBindings {
  className: InputClasses["errorIndicator"]
  "data-size": QdsInputSize
}

export interface QdsInputRequiredIndicatorBindings {
  className: InputClasses["requiredIndicator"]
}

export interface QdsInputApi<IconType> {
  endIcon?: IconType
  iconSize: number
  size: QdsInputSize
  startIcon?: IconType

  // group: prop getters
  getClearTriggerBindings(): QdsInputClearTriggerBindings
  getEndIconBindings(): QdsInputEndIconBindings
  getErrorIndicatorBindings(): QdsInputErrorIndicatorBindings
  getErrorTextBindings(): QdsInputErrorTextBindings
  getGroupBindings(): QdsInputGroupBindings
  getHintBindings(): QdsInputHintBindings
  getInputBindings(): QdsInputInputBindings
  getLabelBindings(): QdsInputLabelBindings
  getRequiredIndicatorBindings(): QdsInputRequiredIndicatorBindings
  getRootBindings(): QdsInputRootBindings
  getStartIconBindings(): QdsInputStartIconBindings
}
