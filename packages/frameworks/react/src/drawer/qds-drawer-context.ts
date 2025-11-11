// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsDrawerApi} from "@qualcomm-ui/qds-core/drawer"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsDrawerContextProvider, useQdsDrawerContext] =
  createGuardedContext<QdsDrawerApi>({
    hookName: "useQdsDrawerContext",
    providerName: "<QdsDrawerContextProvider>",
    strict: true,
  })
