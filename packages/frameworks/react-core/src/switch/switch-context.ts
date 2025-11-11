// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {SwitchApi} from "@qualcomm-ui/core/switch"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [SwitchContextProvider, useSwitchContext] =
  createGuardedContext<SwitchApi>({
    hookName: "useSwitchContext",
    providerName: "<SwitchContextProvider>",
    strict: true,
  })
