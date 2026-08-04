// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"

import type {tagAnatomy} from "./tag.anatomy.js"
import type {tagClasses} from "./tag.classes.js"

/** @deprecated use "lime" */
// eslint-disable-next-line @typescript-eslint/naming-convention
export type QdsTagEmphasis__deprecated = "kiwi"

export type QdsTagEmphasis =
  | "outline-brand"
  | "outline-neutral"
  | "neutral"
  | "amber"
  | "blue"
  | "cyan"
  | "green"
  | "lime"
  | "magenta"
  | "orange"
  | "purple"
  | "red"
  | "teal"
  | "violet"
  | "yellow"
  | QdsTagEmphasis__deprecated

/**
 * @deprecated in {@link https://github.com/qualcomm/qualcomm-ui/blob/main/packages/frameworks/react/CHANGELOG.md#1160 v1.16.0}, migrate to {@link QdsTagShape}
 */
export type QdsTagRadius = QdsTagShape

export type QdsTagShape = "square" | "rounded"

export type QdsTagSize = "sm" | "md" | "lg" | "xl"

/** @deprecated use `render` */
// eslint-disable-next-line @typescript-eslint/naming-convention
export type QdsTagVariant__deprecated = "link"

export type QdsTagVariant =
  | "selectable"
  | "dismissable"
  | QdsTagVariant__deprecated

export interface QdsTagApiProps {
  /**
   * Controls the component's interactivity. If `true`, the component becomes
   * unresponsive to input and is visually dimmed to indicate its disabled state.
   */
  disabled?: boolean

  /**
   * Governs the color of the tag.
   * @default 'outline-brand'
   */
  emphasis?: QdsTagEmphasis

  /**
   * @deprecated in {@link https://github.com/qualcomm/qualcomm-ui/blob/main/packages/frameworks/react/CHANGELOG.md#1160 v1.16.0}, migrate to {@link shape}
   *
   * Governs the shape of the tag.
   *
   * @default 'square'
   */
  radius?: QdsTagRadius

  /**
   * Governs the shape of the tag.
   *
   * @since 1.16.0
   *
   * @default 'square'
   */
  shape?: QdsTagShape

  /**
   * Governs the size of the text, icons, spacing, and padding.
   * @default 'md'
   */
  size?: QdsTagSize

  /**
   * Governs the interactive style of the tag.
   */
  variant?: QdsTagVariant
}

type TagClasses = typeof tagClasses

type PartName = AnatomyPartName<typeof tagAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"tag", P> {}

export interface QdsTagCommonRootBindings extends Part<"root"> {
  "aria-disabled"?: BooleanAriaAttr
  className: TagClasses["root"]
  "data-disabled": BooleanDataAttr
  "data-emphasis": QdsTagEmphasis
  "data-selected": BooleanDataAttr
  "data-shape": QdsTagShape
  "data-size": QdsTagSize
  "data-variant"?: QdsTagVariant
  tabIndex?: -1
}

export interface QdsTagElementRootBindings extends QdsTagCommonRootBindings {
  "data-active"?: BooleanDataAttr
}

export interface QdsTagButtonRootBindings extends QdsTagCommonRootBindings {
  "aria-pressed"?: BooleanAriaAttr
}

export type QdsTagRootBindings =
  | QdsTagElementRootBindings
  | QdsTagButtonRootBindings

export interface QdsTagStartIconBindings extends Part<"startIcon"> {
  className: TagClasses["icon"]
}

export interface QdsTagEndIconBindings extends Part<"endIcon"> {
  className: TagClasses["icon"]
}

export interface QdsTagDismissButtonBindings extends Part<"dismissButton"> {
  "aria-label": string
  className: TagClasses["dismissButton"]
  "data-disabled": BooleanDataAttr
  "data-size": QdsTagSize
  disabled: boolean | undefined
  type: "button"
}

export interface QdsTagApi {
  getDismissButtonBindings(): QdsTagDismissButtonBindings
  getEndIconBindings(): QdsTagEndIconBindings
  getRootBindings(): QdsTagRootBindings
  getStartIconBindings(): QdsTagStartIconBindings
  isInteractiveVariant(): boolean
}
