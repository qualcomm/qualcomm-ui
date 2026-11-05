// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsListItemApi} from "@qualcomm-ui/qds-core/list-item"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsListItemContextProvider, useQdsListItemContext] =
  createGuardedContext<QdsListItemApi>({
    hookName: "useQdsListItemContext",
    providerName: "<QdsListItemContextProvider>",
    strict: true,
  })
