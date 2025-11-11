// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {MenuTriggerContextValue} from "@qualcomm-ui/core/menu"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [MenuTriggerContextProvider, useMenuTriggerContext] =
  createGuardedContext<MenuTriggerContextValue>({
    hookName: "useMenuTriggerContext",
    providerName: "<MenuTriggerContextProvider>",
    strict: true,
  })
