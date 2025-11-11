// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsProgressApi} from "@qualcomm-ui/qds-core/progress"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsProgressContextProvider, useQdsProgressContext] =
  createGuardedContext<QdsProgressApi>({
    hookName: "useQdsProgressContext",
    providerName: "<QdsProgressContextProvider>",
    strict: true,
  })
