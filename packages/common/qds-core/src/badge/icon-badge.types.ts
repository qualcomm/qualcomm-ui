// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {
  BadgeClasses,
  QdsBadgeCategoryEmphasis,
  QdsBadgeExtendedSize,
  QdsBadgeSemanticEmphasis,
  QdsBaseBadgeProps,
} from "./badge.types"

export type QdsIconBadgeVariant = "default" | "subtle"

export interface QdsIconBadgeProps extends QdsBaseBadgeProps {
  /**
   * Governs the color of the icon badge.
   * @default 'neutral'
   */
  emphasis?: QdsBadgeSemanticEmphasis | QdsBadgeCategoryEmphasis

  /**
   * Governs the size of the badge.
   * @default 'md'
   */
  size?: QdsBadgeExtendedSize

  /**
   * Governs the style of the icon badge.
   * @default 'default'
   */
  variant?: QdsIconBadgeVariant
}

export interface QdsIconBadgeRootBindings {
  className: BadgeClasses["root"]
  "data-disabled": BooleanDataAttr
  "data-emphasis": QdsBadgeSemanticEmphasis | QdsBadgeCategoryEmphasis
  "data-part": "root"
  "data-scope": "icon-badge"
  "data-size": QdsBadgeExtendedSize
  "data-variant": QdsIconBadgeVariant
}

export interface QdsIconBadgeIconBindings {
  className: BadgeClasses["icon"]
  "data-part": "icon"
  "data-scope": "icon-badge"
  "data-size": QdsBadgeExtendedSize
}

export interface QdsIconBadgeApi {
  getIconBindings(): QdsIconBadgeIconBindings
  getRootBindings(): QdsIconBadgeRootBindings
}
