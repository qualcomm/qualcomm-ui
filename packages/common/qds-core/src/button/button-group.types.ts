// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {buttonClasses} from "./button.classes"
import type {
  QdsButtonDensity,
  QdsButtonEmphasis,
  QdsButtonSize,
  QdsButtonVariant,
} from "./button.types"

/**
 * The button group layouts
 */
export type QdsButtonGroupLayout = "hug" | "start" | "end" | "fill"

export interface QdsButtonGroupApiProps {
  /**
   * Accessible name for the button group.
   */
  ["aria-label"]?: string

  /**
   * Id(s) of element(s) that label the button group.
   */
  ["aria-labelledby"]?: string

  /**
   * The density of the button. Governs padding and height.
   *
   * @default 'default'
   */
  density?: QdsButtonDensity

  /**
   * Disables all buttons within the group.
   *
   * @default false
   */
  disabled?: boolean | undefined

  /**
   * The emphasis of the buttons in the group.
   */
  emphasis?: QdsButtonEmphasis

  /**
   * The layout used to display the button group.
   * - `hug`: Content-sized; width matches the buttons only (default).
   * - `start`: Full width; buttons are aligned to the start edge.
   * - `end`: Full width; buttons are aligned to the end edge.
   * - `fill`: Full width; buttons share space evenly.
   *
   * @default 'hug'
   */
  layout?: QdsButtonGroupLayout

  /**
   * The size of the buttons in the group.
   *
   * @default 'md'
   */
  size?: QdsButtonSize

  /**
   * The variant of the buttons in the group.
   */
  variant?: QdsButtonVariant
}

export interface QdsButtonGroupBindings {
  "aria-label"?: string
  "aria-labelledby"?: string
  className: (typeof buttonClasses)["group"]
  "data-disabled": BooleanDataAttr
  "data-emphasis"?: QdsButtonEmphasis
  "data-layout": QdsButtonGroupLayout
  "data-scope": "button-group"
  "data-size"?: QdsButtonSize
  "data-variant"?: QdsButtonVariant
  role?: "group"
}
