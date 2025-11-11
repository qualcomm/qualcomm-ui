// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsTabsApi} from "@qualcomm-ui/qds-core/tabs"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsTabsContextProvider, useQdsTabsContext] =
  createGuardedContext<QdsTabsApi>({
    hookName: "useQdsTabsContext",
    providerName: "<QdsTabsContextProvider>",
    strict: true,
  })
