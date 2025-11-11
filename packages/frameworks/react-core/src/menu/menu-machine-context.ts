// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {MenuSchema} from "@qualcomm-ui/core/menu"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"
import type {Machine} from "@qualcomm-ui/utils/machine"

export const [MenuMachineContextProvider, useMenuMachineContext] =
  createGuardedContext<Machine<MenuSchema>>({
    hookName: "useMenuMachineContext",
    providerName: "<MenuMachineContextProvider>",
    strict: true,
  })
