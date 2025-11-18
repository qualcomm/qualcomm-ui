// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {badgeClasses} from "./badge.classes"

export type BadgeClasses = typeof badgeClasses

export type QdsBadgeBasicSize = "sm" | "md" | "lg"
export type QdsBadgeExtraSize = "xs" | QdsBadgeBasicSize | "xl"
export type QdsBadgeExtendedSize = "xxs" | QdsBadgeExtraSize

export type QdsBadgeSemanticEmphasis =
  | "neutral"
  | "brand"
  | "info"
  | "success"
  | "warning"
  | "danger"

export type QdsBadgeCategoryEmphasis =
  | "blue"
  | "cyan"
  | "green"
  | "kiwi"
  | "magenta"
  | "orange"
  | "purple"
  | "red"
  | "teal"
  | "yellow"

export interface QdsBaseBadgeProps {
  /**
   * The badge disabled state.
   */
  disabled?: boolean
}
