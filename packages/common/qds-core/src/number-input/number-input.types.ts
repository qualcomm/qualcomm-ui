// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsInputSize} from "@qualcomm-ui/qds-core/input"

import type {numberInputClasses} from "./number-input.classes"

export interface QdsNumberInputApiProps {
  /**
   * The size of the input field and its elements. Governs properties like font
   * size, item padding, and icon sizes.
   *
   * @default 'md'
   */
  size?: QdsInputSize | undefined
}

type NumberInputClasses = typeof numberInputClasses

export interface QdsNumberInputDecrementTriggerBindings {
  className: NumberInputClasses["stepTrigger"]
  "data-size": QdsInputSize
}

export interface QdsNumberInputIncrementTriggerBindings {
  className: NumberInputClasses["stepTrigger"]
  "data-size": QdsInputSize
}

export interface QdsNumberInputControlBindings {
  className: NumberInputClasses["control"]
  "data-size": QdsInputSize
}

export interface QdsNumberInputInputGroupBindings {
  className: NumberInputClasses["inputGroup"]
  "data-part": "input-group"
  "data-size": QdsInputSize
}

export interface QdsNumberInputInputBindings {
  className: NumberInputClasses["input"]
  "data-size": QdsInputSize
}

export interface QdsNumberInputErrorIndicatorBindings {
  className: NumberInputClasses["errorIndicator"]
  "data-size": QdsInputSize
}

export interface QdsNumberInputApi {
  size: QdsInputSize

  // group: prop getters
  getControlBindings(): QdsNumberInputControlBindings
  getDecrementTriggerBindings(): QdsNumberInputDecrementTriggerBindings
  getErrorIndicatorBindings(): QdsNumberInputErrorIndicatorBindings
  getIncrementTriggerBindings(): QdsNumberInputIncrementTriggerBindings
  getInputBindings(): QdsNumberInputInputBindings
  getInputGroupBindings(): QdsNumberInputInputGroupBindings
}
