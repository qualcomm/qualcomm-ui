// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {
  BadgeClasses,
  QdsBadgeBasicSize,
  QdsBadgeCategoryEmphasis,
  QdsBadgeSemanticEmphasis,
  QdsBaseBadgeProps,
} from "./badge.types"

export type QdsTextBadgeVariant = "default" | "subtle"

export interface QdsTextBadgeProps extends QdsBaseBadgeProps {
  /**
   * Governs the color of the text badge.
   * @default 'neutral'
   */
  emphasis?: QdsBadgeSemanticEmphasis | QdsBadgeCategoryEmphasis

  /**
   * Governs the size of the badge.
   * @default 'md'
   */
  size?: QdsBadgeBasicSize

  /**
   * Governs the style of the text badge.
   * @default 'default'
   */
  variant?: QdsTextBadgeVariant
}

export interface QdsTextBadgeRootBindings {
  className: BadgeClasses["root"]
  "data-disabled": BooleanDataAttr
  "data-emphasis": QdsBadgeSemanticEmphasis | QdsBadgeCategoryEmphasis
  "data-part": "root"
  "data-scope": "text-badge"
  "data-size": QdsBadgeBasicSize
  "data-variant": QdsTextBadgeVariant
}

export interface QdsTextBadgeApi {
  getRootBindings(): QdsTextBadgeRootBindings
}
