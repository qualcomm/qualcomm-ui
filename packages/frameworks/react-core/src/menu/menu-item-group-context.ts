// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ItemGroupContext, RadioItemGroupContext} from "@qualcomm-ui/core/menu"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [MenuItemGroupContextProvider, useMenuItemGroupContext] =
  createGuardedContext<ItemGroupContext>({
    hookName: "useMenuItemGroupContext",
    providerName: "<MenuItemGroupContextProvider>",
    strict: true,
  })

export const [MenuRadioItemGroupContextProvider, useMenuRadioItemGroupContext] =
  createGuardedContext<RadioItemGroupContext>({
    hookName: "useMenuItemGroupContext",
    providerName: "<MenuItemGroupContextProvider>",
    strict: true,
  })
