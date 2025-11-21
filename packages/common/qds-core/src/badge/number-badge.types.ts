// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {
  BadgeClasses,
  QdsBadgeBasicSize,
  QdsBaseBadgeProps,
} from "./badge.types"

export type QdsNumberBadgeVariant =
  | "neutral"
  | "neutral-outline"
  | "brand"
  | "brand-outline"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "persistent-black"
  | "persistent-white"

export interface QdsNumberBadgeProps extends QdsBaseBadgeProps {
  /**
   * Maximum value to display.
   * @default 99
   */
  max?: number

  /**
   * Governs the size of the badge.
   * @default 'md'
   */
  size?: QdsBadgeBasicSize

  /**
   * The numeric value to display.
   */
  value?: number

  /**
   * Governs the color and style of the number badge.
   * @default 'neutral'
   */
  variant?: QdsNumberBadgeVariant
}

export interface QdsNumberBadgeRootBindings {
  className: BadgeClasses["root"]
  "data-disabled": BooleanDataAttr
  "data-overflow": BooleanDataAttr
  "data-part": "root"
  "data-scope": "number-badge"
  "data-size": QdsBadgeBasicSize
  "data-variant": QdsNumberBadgeVariant
}

export interface QdsNumberBadgeApi {
  displayValue: number | string | null
  getRootBindings(): QdsNumberBadgeRootBindings
}
