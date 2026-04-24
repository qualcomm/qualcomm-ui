// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {buttonAnatomy} from "./button.anatomy"
import type {buttonClasses} from "./button.classes"

/**
 * The QDS button variants
 */
export type QdsButtonVariant = "fill" | "ghost" | "outline"

/**
 * The QDS button emphasis
 */
export type QdsButtonEmphasis =
  | "neutral"
  | "primary"
  | "danger"
  | "white-persistent"
  | "black-persistent"
  | "inverse"

export type QdsButtonSize = "sm" | "md" | "lg"

export type QdsButtonDensity = "default" | "compact"

export interface QdsButtonApiProps {
  /**
   * The density of the button. Governs padding and height.
   *
   * @default 'default'
   */
  density?: QdsButtonDensity

  /**
   * Controls whether the component is interactive. When `true`, pointer/focus
   * events are blocked, and the component is visually dimmed.
   *
   * @default false
   */
  disabled?: boolean | undefined

  /**
   * The style variant of the button. Governs colors.
   *
   * @default 'neutral'
   */
  emphasis?: QdsButtonEmphasis

  /**
   * The size of the component and its icons.
   *
   * @default 'md'
   */
  size?: QdsButtonSize

  /**
   * The style variant of the button. Governs colors.
   *
   * @default 'fill'
   */
  variant?: QdsButtonVariant
}

type ButtonClasses = typeof buttonClasses

type PartName = AnatomyPartName<typeof buttonAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"button", P> {}

export interface QdsButtonRootBindings extends Part<"root"> {
  className: ButtonClasses["root"]
  "data-density": QdsButtonDensity
  "data-disabled": BooleanDataAttr
  "data-kind": "text"
  "data-size": QdsButtonSize
  "data-variant": QdsButtonVariant
}

export interface QdsButtonStartIconBindings extends Part<"icon"> {
  className: ButtonClasses["icon"]
  "data-density": QdsButtonDensity
  "data-placement": "start"
  "data-size": QdsButtonSize
}

export interface QdsButtonEndIconBindings extends Part<"icon"> {
  className: ButtonClasses["icon"]
  "data-density": QdsButtonDensity
  "data-placement": "end"
  "data-size": QdsButtonSize
}

export interface QdsButtonApi {
  getEndIconBindings(): QdsButtonEndIconBindings
  getRootBindings(): QdsButtonRootBindings
  getStartIconBindings(): QdsButtonStartIconBindings
}
