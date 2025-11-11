// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {RefObject} from "react"

import {createGuardedContext} from "@qualcomm-ui/react-core/context"

interface PortalContextValue {
  /**
   * Specify to override the container element for all child portals.
   */
  container?: RefObject<HTMLElement | null>
}

export const [PortalContextProvider, usePortalContext] =
  createGuardedContext<PortalContextValue>({
    hookName: "usePortalContext",
    providerName: "<PortalContextProvider>",
    strict: true,
  })
