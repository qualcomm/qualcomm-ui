// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {buttonClasses} from "./button.classes"
import type {
  QdsButtonApiProps,
  QdsButtonDensity,
  QdsButtonSize,
  QdsButtonVariant,
} from "./button.types"

export interface QdsIconButtonApiProps extends QdsButtonApiProps {}

type ButtonClasses = typeof buttonClasses

export interface QdsIconButtonRootBindings {
  className: ButtonClasses["root"]
  "data-density": QdsButtonDensity
  "data-disabled": BooleanDataAttr
  "data-part": "root"
  "data-scope": "icon-button"
  "data-size": QdsButtonSize
  "data-variant": QdsButtonVariant
}

export interface QdsIconButtonIconBindings {
  className: ButtonClasses["icon"]
  "data-density": QdsButtonDensity
  "data-part": "icon"
  "data-scope": "icon-button"
  "data-size": QdsButtonSize
}

export interface QdsIconButtonApi {
  getIconBindings(): QdsIconButtonIconBindings
  getRootBindings(): QdsIconButtonRootBindings
}
