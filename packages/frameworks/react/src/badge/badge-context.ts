// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  QdsNumberBadgeProps,
  QdsStatusBadgeProps,
} from "@qualcomm-ui/qds-core/badge"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

/**
 * @since next-release
 */
export interface BadgeContextValue {
  numberBadge: Pick<QdsNumberBadgeProps, "disabled" | "emphasis" | "size">
  statusBadge: Pick<QdsStatusBadgeProps, "disabled" | "size">
}

/**
 * @since next-release
 */
export const [BadgeContextProvider, useBadgeContext] =
  createGuardedContext<BadgeContextValue>({
    hookName: "useBadgeContext",
    providerName: "<BadgeContextProvider>",
    strict: false,
  })
