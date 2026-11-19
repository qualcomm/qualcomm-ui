// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FilterPanelApi} from "@qualcomm-ui/core/filter-panel"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [FilterPanelContextProvider, useFilterPanelContext] =
  createGuardedContext<FilterPanelApi>({
    hookName: "useFilterPanelContext",
    providerName: "<FilterPanelContextProvider>",
    strict: true,
  })
