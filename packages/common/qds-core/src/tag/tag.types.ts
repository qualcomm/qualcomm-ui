// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TagVariant} from "@qualcomm-ui/core/tag"

import type {tagClasses} from "./tag.classes"

export type QdsTagEmphasis =
  | "outline-brand"
  | "outline-neutral"
  | "neutral"
  | "blue"
  | "cyan"
  | "teal"
  | "green"
  | "kiwi"
  | "yellow"
  | "orange"
  | "red"
  | "magenta"
  | "purple"

export type QdsTagRadius = "square" | "rounded"

export type QdsTagSize = "sm" | "md" | "lg"

// backwards compatibility. `TagVariant` was added in an update
export type QdsTagVariant = TagVariant

export interface QdsTagApiProps {
  /**
   * Governs the color of the tag.
   * @default 'outline-brand'
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

/** @deprecated no longer used, migrate to {@link QdsTagRootBindings} */
export interface QdsTagSpanRootBindings extends QdsTagRootBindings {}

/** @deprecated no longer used, migrate to {@link QdsTagRootBindings} */
export interface QdsTagButtonRootBindings extends QdsTagRootBindings {}

export interface QdsTagRootBindings {
  className: TagClasses["root"]
  "data-emphasis": QdsTagEmphasis
  "data-radius": QdsTagRadius
  "data-size": QdsTagSize
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
  "aria-label": string
  className: TagClasses["dismissButton"]
  "data-size": QdsTagSize
  type: "button"
}

export interface QdsTagApi {
  getDismissButtonBindings(): QdsTagDismissButtonBindings
  getEndIconBindings(): QdsTagEndIconBindings
  getRootBindings(): QdsTagRootBindings
  getStartIconBindings(): QdsTagStartIconBindings
  isInteractiveVariant(): boolean
}
