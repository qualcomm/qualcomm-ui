// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {tagAnatomy} from "./tag.anatomy"
import type {tagClasses} from "./tag.classes"

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

export type QdsTagSize = "sm" | "md" | "lg"

export type QdsTagVariant = "link" | "selectable" | "dismissable"

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

export interface QdsTagSpanRootBindings extends Part<"root"> {
  className: TagClasses["root"]
  "data-disabled": BooleanDataAttr
  "data-emphasis": QdsTagEmphasis
  "data-shape": QdsTagShape
  "data-size": QdsTagSize
  "data-variant"?: QdsTagVariant
}

export interface QdsTagButtonRootBindings extends Part<"root"> {
  className: TagClasses["root"]
  "data-disabled": BooleanDataAttr
  "data-emphasis": QdsTagEmphasis
  "data-shape": QdsTagShape
  "data-size": QdsTagSize
  "data-variant"?: QdsTagVariant
  disabled: boolean | undefined
}

export type QdsTagRootBindings =
  | QdsTagSpanRootBindings
  | QdsTagButtonRootBindings

export interface QdsTagStartIconBindings extends Part<"startIcon"> {
  className: TagClasses["icon"]
  "data-size": QdsTagSize
}

export interface QdsTagEndIconBindings extends Part<"endIcon"> {
  className: TagClasses["icon"]
  "data-size": QdsTagSize
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
