// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TabsApi} from "@qualcomm-ui/core/tabs"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [TabsContextProvider, useTabsContext] =
  createGuardedContext<TabsApi>({
    hookName: "useTabsContext",
    providerName: "<TabsContextProvider>",
    strict: true,
  })
