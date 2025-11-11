// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsSwitchApi} from "@qualcomm-ui/qds-core/switch"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsSwitchContextProvider, useQdsSwitchContext] =
  createGuardedContext<QdsSwitchApi>({
    hookName: "useQdsSwitchContext",
    providerName: "<QdsSwitchContextProvider>",
    strict: true,
  })
