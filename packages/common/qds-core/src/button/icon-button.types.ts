// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {buttonClasses} from "./button.classes.js"
import type {
  QdsButtonApiProps,
  QdsButtonDensity,
  QdsButtonSize,
  QdsButtonVariant,
} from "./button.types.js"
import type {iconButtonAnatomy} from "./icon-button.anatomy.js"

export type QdsIconButtonShape = "square" | "rounded"

export interface QdsIconButtonApiProps extends QdsButtonApiProps {
  /**
   * Governs the shape of the icon button.
   *
   * @default 'square'
   */
  shape?: QdsIconButtonShape
}

type ButtonClasses = typeof buttonClasses

type PartName = AnatomyPartName<typeof iconButtonAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"iconButton", P> {}

export interface QdsIconButtonRootBindings extends Part<"root"> {
  className: ButtonClasses["root"]
  "data-density": QdsButtonDensity
  "data-disabled": BooleanDataAttr
  "data-shape": QdsIconButtonShape
  "data-size": QdsButtonSize
  "data-variant": QdsButtonVariant
}

export interface QdsIconButtonIconBindings extends Part<"icon"> {
  className: ButtonClasses["icon"]
  "data-density": QdsButtonDensity
  "data-size": QdsButtonSize
}

export interface QdsIconButtonApi {
  getIconBindings(): QdsIconButtonIconBindings
  getRootBindings(): QdsIconButtonRootBindings
  size: QdsButtonSize
}
