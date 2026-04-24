// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"

import type {inlineIconButtonAnatomy} from "./inline-icon-button.anatomy"
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

type PartName = AnatomyPartName<typeof inlineIconButtonAnatomy>
interface Part<P extends PartName> extends AnatomyPart<"inlineIconButton", P> {}

export interface QdsInlineIconButtonRootBindings extends Part<"root"> {
  className: IconButtonClasses["root"]
  "data-emphasis": QdsInlineIconButtonEmphasis
  "data-size": QdsInlineIconButtonSize
  "data-variant": QdsInlineIconButtonVariant
}

export interface QdsInlineIconButtonIconBindings extends Part<"icon"> {
  className: IconButtonClasses["icon"]
  "data-emphasis": QdsInlineIconButtonEmphasis
  "data-size": QdsInlineIconButtonSize
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
