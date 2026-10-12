// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {InjectionToken, type Signal} from "@angular/core"

import type {
  QdsNumberBadgeProps,
  QdsStatusBadgeProps,
} from "@qualcomm-ui/qds-core/badge"

export interface BadgeTokenContext {
  numberBadge: Signal<
    Pick<QdsNumberBadgeProps, "disabled" | "emphasis" | "size">
  >
  statusBadge: Signal<Pick<QdsStatusBadgeProps, "disabled" | "size">>
}

export const BADGE_CONTEXT_TOKEN = new InjectionToken<BadgeTokenContext>(
  "BADGE_TOKEN",
)
