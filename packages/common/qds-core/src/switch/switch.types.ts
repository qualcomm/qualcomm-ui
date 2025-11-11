// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {inputClasses} from "@qualcomm-ui/qds-core/input"

import type {switchClasses} from "./switch.classes"

export type QdsSwitchSize = "sm" | "md"

export interface QdsSwitchApiProps {
  /**
   * Size of the component and its label.
   *
   * @default "md"
   */
  size?: QdsSwitchSize
}

type SwitchClasses = typeof switchClasses
type InputClasses = typeof inputClasses

export interface QdsSwitchRootBindings {
  className: SwitchClasses["root"]
  "data-size": QdsSwitchSize
}

export interface QdsSwitchControlBindings {
  className: SwitchClasses["control"]
  "data-size": QdsSwitchSize
}

export interface QdsSwitchThumbBindings {
  className: SwitchClasses["thumb"]
  "data-size": QdsSwitchSize
}

export interface QdsSwitchLabelBindings {
  className: SwitchClasses["label"]
}

export interface QdsSwitchErrorTextBindings {
  className: InputClasses["errorText"]
}

export interface QdsSwitchHiddenInputBindings {
  className: SwitchClasses["hiddenInput"]
}

export interface QdsSwitchApi {
  getControlBindings(): QdsSwitchControlBindings
  getErrorTextBindings(): QdsSwitchErrorTextBindings
  getHiddenInputBindings(): QdsSwitchHiddenInputBindings
  getLabelBindings(): QdsSwitchLabelBindings
  getRootBindings(): QdsSwitchRootBindings
  getThumbBindings(): QdsSwitchThumbBindings
  size: QdsSwitchSize
}
