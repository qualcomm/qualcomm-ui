// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsFilterPanelApi} from "@qualcomm-ui/qds-core/filter-panel"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsFilterPanelContextProvider, useQdsFilterPanelContext] =
  createGuardedContext<QdsFilterPanelApi>({
    hookName: "useQdsFilterPanelContext",
    providerName: "<QdsFilterPanelContextProvider>",
    strict: true,
  })
