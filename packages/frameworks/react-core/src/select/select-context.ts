// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ItemState, SelectApi} from "@qualcomm-ui/core/select"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [SelectContextProvider, useSelectContext] =
  createGuardedContext<SelectApi>({
    hookName: "useSelectContext",
    providerName: "<SelectContextProvider>",
    strict: true,
  })

export const [SelectItemContextProvider, useSelectItemContext] =
  createGuardedContext<ItemState>({
    hookName: "useSelectContext",
    providerName: "<SelectContextProvider>",
    strict: true,
  })
