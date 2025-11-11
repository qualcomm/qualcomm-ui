// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ProgressApi} from "@qualcomm-ui/core/progress"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [ProgressRingContextProvider, useProgressRingContext] =
  createGuardedContext<ProgressApi>({
    hookName: "useProgressRingContext",
    providerName: "<ProgressRingContextProvider>",
    strict: true,
  })
