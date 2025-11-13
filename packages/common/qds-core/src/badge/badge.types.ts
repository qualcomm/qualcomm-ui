// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {badgeClasses} from "./badge.classes"

export type QdsBadgeType = "count" | "icon" | "text" | "status"

export type QdsBadgeBasicSize = "sm" | "md" | "lg"
export type QdsBadgeExtendedSize = "xs" | QdsBadgeBasicSize | "xl"
export type QdsBadgeIconSize = "xxs" | QdsBadgeExtendedSize

export type QdsBadgeSize =
  | QdsBadgeBasicSize
  | QdsBadgeExtendedSize
  | QdsBadgeIconSize

export type QdsBadgeSemanticEmphasis =
  | "neutral"
  | "brand"
  | "info"
  | "success"
  | "warning"
  | "danger"

export type QdsBadgeCategoryEmphasis =
  | "cat-1"
  | "cat-2"
  | "cat-3"
  | "cat-4"
  | "cat-5"
  | "cat-6"
  | "cat-7"
  | "cat-8"
  | "cat-9"
  | "cat-10"

export type QdsBadgeCountVariant =
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

export type QdsBadgeStatusEmphasis = QdsBadgeSemanticEmphasis
export type QdsBadgeStatusVariant = "filled" | "outlined"

export type QdsBadgeIconTextEmphasis =
  | QdsBadgeSemanticEmphasis
  | QdsBadgeCategoryEmphasis
export type QdsBadgeIconTextVariant = "default" | "subtle"

interface QdsBadgeBaseProps {
  /**
   * The badge disabled state.
   */
  disabled?: boolean
}

export interface QdsBadgeCountProps extends QdsBadgeBaseProps {
  /**
   * The numeric count to display.
   */
  count?: number

  /**
   * Maximum count to display.
   * @default 99
   */
  max?: number

  /**
   * Governs the size of the badge.
   * @default 'md'
   */
  size?: QdsBadgeBasicSize

  /**
   * The badge type.
   */
  type: "count"

  /**
   * Governs the color and style of the count badge.
   * @default 'neutral'
   */
  variant?: QdsBadgeCountVariant
}

export interface QdsBadgeStatusProps extends QdsBadgeBaseProps {
  /**
   * Governs the color of the status badge.
   * @default 'neutral'
   */
  emphasis?: QdsBadgeStatusEmphasis

  /**
   * Governs the size of the badge.
   * @default 'md'
   */
  size?: QdsBadgeExtendedSize

  /**
   * The badge type.
   */
  type: "status"

  /**
   * Governs the style of the status badge.
   * @default 'filled'
   */
  variant?: QdsBadgeStatusVariant
}

export interface QdsBadgeIconProps extends QdsBadgeBaseProps {
  /**
   * Governs the color of the icon badge.
   * @default 'neutral'
   */
  emphasis?: QdsBadgeIconTextEmphasis

  /**
   * Governs the size of the badge.
   * @default 'md'
   */
  size?: QdsBadgeIconSize

  /**
   * The badge type.
   */
  type: "icon"

  /**
   * Governs the style of the icon badge.
   * @default 'default'
   */
  variant?: QdsBadgeIconTextVariant
}

export interface QdsBadgeTextProps extends QdsBadgeBaseProps {
  /**
   * Governs the color of the text badge.
   * @default 'neutral'
   */
  emphasis?: QdsBadgeIconTextEmphasis

  /**
   * Governs the size of the badge.
   * @default 'md'
   */
  size?: QdsBadgeBasicSize

  /**
   * The badge type.
   */
  type?: "text"

  /**
   * Governs the style of the text badge.
   * @default 'default'
   */
  variant?: QdsBadgeIconTextVariant
}

export type QdsBadgeApiProps =
  | QdsBadgeCountProps
  | QdsBadgeStatusProps
  | QdsBadgeIconProps
  | QdsBadgeTextProps

type BadgeClasses = typeof badgeClasses

export interface QdsBadgeRootBindings {
  className: BadgeClasses["root"]
  "data-disabled": BooleanDataAttr
  "data-emphasis"?: string
  "data-overflow": BooleanDataAttr
  "data-part": "root"
  "data-scope": "badge"
  "data-size": QdsBadgeSize
  "data-type": QdsBadgeType
  "data-variant"?: string
}

export interface QdsBadgeIconBindings {
  className: BadgeClasses["icon"]
  "data-part": "icon"
  "data-scope": "badge"
  "data-size": QdsBadgeSize
}

export interface QdsBadgeApi {
  getDisplayCount(): number | string | null
  getIconBindings(): QdsBadgeIconBindings
  getRootBindings(): QdsBadgeRootBindings
  type: QdsBadgeType
}
