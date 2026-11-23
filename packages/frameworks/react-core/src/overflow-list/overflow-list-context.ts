// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {OverflowListApi} from "@qualcomm-ui/core/overflow-list"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [OverflowListContextProvider, useOverflowListContext] =
  createGuardedContext<OverflowListApi>({
    hookName: "useOverflowListContext",
    providerName: "<OverflowListContextProvider>",
    strict: true,
  })
