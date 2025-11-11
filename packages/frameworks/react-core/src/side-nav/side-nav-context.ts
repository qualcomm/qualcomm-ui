// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {SideNavApi} from "@qualcomm-ui/core/side-nav"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [SideNavContextProvider, useSideNavContext] =
  createGuardedContext<SideNavApi>({
    hookName: "useSideNavContext",
    providerName: "<SideNavContextProvider>",
    strict: true,
  })
