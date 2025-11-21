// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {
  BadgeClasses,
  QdsBadgeExtraSize,
  QdsBadgeSemanticEmphasis,
  QdsBaseBadgeProps,
} from "./badge.types"

export type QdsStatusBadgeVariant = "filled" | "outlined"

export interface QdsStatusBadgeProps extends QdsBaseBadgeProps {
  /**
   * Governs the color of the status badge.
   * @default 'neutral'
   */
  emphasis?: QdsBadgeSemanticEmphasis

  /**
   * Governs the size of the badge.
   * @default 'md'
   */
  size?: QdsBadgeExtraSize

  /**
   * Governs the style of the status badge.
   * @default 'filled'
   */
  variant?: QdsStatusBadgeVariant
}

export interface QdsStatusBadgeRootBindings {
  className: BadgeClasses["root"]
  "data-disabled": BooleanDataAttr
  "data-emphasis": QdsBadgeSemanticEmphasis
  "data-part": "root"
  "data-scope": "status-badge"
  "data-size": QdsBadgeExtraSize
  "data-variant": QdsStatusBadgeVariant
}

export interface QdsStatusBadgeApi {
  getRootBindings(): QdsStatusBadgeRootBindings
}
