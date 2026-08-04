// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {
  QdsButtonDensity,
  QdsButtonEmphasis,
  QdsButtonSize,
  QdsButtonVariant,
} from "./button.types.js"

/**
 * Props and bindings shared between button group and split button.
 */

export interface QdsButtonGroupCommonProps {
  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label aria-label}
   * attribute.
   */
  ["aria-label"]?: string

  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby aria-labelledby}
   * attribute.
   */
  ["aria-labelledby"]?: string

  /**
   * The density of the buttons. Governs padding and height.
   *
   * @default 'default'
   */
  density?: QdsButtonDensity

  /**
   * Disables every button in the group.
   *
   * @default false
   */
  disabled?: boolean | undefined

  /**
   * The emphasis of the buttons in the group.
   */
  emphasis?: QdsButtonEmphasis

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

export interface QdsButtonGroupCommonBindings {
  "aria-label"?: string
  "aria-labelledby"?: string
  "data-density": QdsButtonDensity
  "data-disabled": BooleanDataAttr
  "data-emphasis"?: QdsButtonEmphasis
  "data-size": QdsButtonSize
  "data-variant"?: QdsButtonVariant
  role?: "group"
}
