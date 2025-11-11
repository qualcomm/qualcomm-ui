// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {tagClasses} from "./tag.classes"

export type QdsTagEmphasis = "brand" | "outline-neutral" | "neutral"

export type QdsTagRadius = "square" | "rounded"

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
   * @default 'brand'
   */
  emphasis?: QdsTagEmphasis

  /**
   * Governs the shape of the tag.
   *
   * @default 'square'
   */
  radius?: QdsTagRadius

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

export interface QdsTagRootBindings {
  className: TagClasses["root"]
  "data-disabled": BooleanDataAttr
  "data-emphasis": QdsTagEmphasis
  "data-part": "root"
  "data-radius": QdsTagRadius
  "data-scope": "tag"
  "data-size": QdsTagSize
  "data-variant"?: QdsTagVariant
  disabled: boolean | undefined
}

export interface QdsTagStartIconBindings {
  className: TagClasses["icon"]
  "data-part": "start-icon"
  "data-scope": "tag"
  "data-size": QdsTagSize
}

export interface QdsTagEndIconBindings {
  className: TagClasses["icon"]
  "data-part": "end-icon"
  "data-scope": "tag"
  "data-size": QdsTagSize
}

export interface QdsTagDismissButtonBindings {
  className: TagClasses["dismissButton"]
  "data-disabled": BooleanDataAttr
  "data-size": QdsTagSize
  disabled: boolean | undefined
}

export interface QdsTagApi {
  getDismissButtonBindings(): QdsTagDismissButtonBindings
  getEndIconBindings(): QdsTagEndIconBindings
  getRootBindings(): QdsTagRootBindings
  getStartIconBindings(): QdsTagStartIconBindings
}
