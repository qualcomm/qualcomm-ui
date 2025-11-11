// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {inlineIconButtonClasses} from "./inline-icon-button.classes"

export type QdsInlineIconButtonSize = "sm" | "md" | "lg"
export type QdsInlineIconButtonEmphasis =
  | "neutral"
  | "persistent-white"
  | "persistent-black"
export type QdsInlineIconButtonVariant = "fixed" | "scale"

export interface QdsInlineIconButtonApiProps {
  /**
   * The style variant of the button. Governs color.
   * TODO: link to design system docs.
   *
   * @default 'neutral'
   */
  emphasis?: QdsInlineIconButtonEmphasis

  /**
   * The size of the button and its icon.
   *
   * @default 'md'
   */
  size?: QdsInlineIconButtonSize

  /**
   * The style variant of the button's icon that controls its size
   *
   * @option `scale`: The icon size scales with the button's size
   * @option `fixed`: The icon size is constant, regardless of the button's size
   *
   * @default 'fixed'
   */
  variant?: QdsInlineIconButtonVariant
}

type IconButtonClasses = typeof inlineIconButtonClasses

export interface QdsInlineIconButtonCommonBindings {
  "data-scope": "inline-icon-button"
}

export interface QdsInlineIconButtonRootBindings
  extends QdsInlineIconButtonCommonBindings {
  className: IconButtonClasses["root"]
  "data-emphasis": QdsInlineIconButtonEmphasis
  "data-scope": "inline-icon-button"
  "data-size": QdsInlineIconButtonSize
  "data-variant": QdsInlineIconButtonVariant
}

export interface QdsInlineIconButtonIconBindings
  extends QdsInlineIconButtonCommonBindings {
  className: IconButtonClasses["icon"]
  "data-emphasis": QdsInlineIconButtonEmphasis
  "data-part": "icon"
  "data-scope": "inline-icon-button"
  "data-variant": QdsInlineIconButtonVariant
}

export interface QdsInlineIconButtonApi {
  emphasis: QdsInlineIconButtonEmphasis
  size: QdsInlineIconButtonSize
  variant: QdsInlineIconButtonVariant

  // group: prop getters
  getIconBindings(): QdsInlineIconButtonIconBindings
  getRootBindings(): QdsInlineIconButtonRootBindings
}
