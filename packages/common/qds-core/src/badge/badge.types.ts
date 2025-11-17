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

export interface QdsBaseBadgeProps {
  /**
   * The badge disabled state.
   */
  disabled?: boolean
}
