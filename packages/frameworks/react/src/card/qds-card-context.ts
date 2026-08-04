// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsCardApi} from "@qualcomm-ui/qds-core/card"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsCardContextProvider, useQdsCardContext] =
  createGuardedContext<QdsCardApi>({
    hookName: "useQdsCardContext",
    providerName: "<QdsCardContextProvider>",
    strict: true,
  })
