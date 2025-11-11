// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsTreeApi} from "@qualcomm-ui/qds-core/tree"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsTreeContextProvider, useQdsTreeContext] =
  createGuardedContext<QdsTreeApi>({
    hookName: "useQdsTreeContext",
    providerName: "<QdsTreeContextProvider>",
    strict: true,
  })
