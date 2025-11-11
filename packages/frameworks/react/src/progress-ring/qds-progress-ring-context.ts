// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsProgressRingApi} from "@qualcomm-ui/qds-core/progress-ring"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsProgressRingContextProvider, useQdsProgressRingContext] =
  createGuardedContext<QdsProgressRingApi>({
    hookName: "useQdsProgressRingContext",
    providerName: "<QdsProgressRingContextProvider>",
    strict: true,
  })
