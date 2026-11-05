// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  QdsNumberBadgeProps,
  QdsStatusBadgeProps,
} from "@qualcomm-ui/qds-core/badge"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

/**
 * @since 1.32.0
 */
export interface BadgeContextValue {
  numberBadgeProps: Pick<QdsNumberBadgeProps, "disabled" | "emphasis" | "size">
  statusBadgeProps: Pick<QdsStatusBadgeProps, "disabled" | "size">
}

/**
 * @since 1.32.0
 */
export const [BadgeContextProvider, useBadgeContext] =
  createGuardedContext<BadgeContextValue>({
    hookName: "useBadgeContext",
    providerName: "<BadgeContextProvider>",
    strict: false,
  })
