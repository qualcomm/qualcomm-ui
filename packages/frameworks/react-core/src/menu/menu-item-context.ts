// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ItemProps, ItemState, OptionItemProps} from "@qualcomm-ui/core/menu"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [MenuItemContextProvider, useMenuItemContext] =
  createGuardedContext<ItemProps & ItemState>({
    hookName: "useMenuItemContext",
    providerName: "<MenuItemContextProvider>",
    strict: true,
  })

export const [MenuOptionItemContextProvider, useMenuOptionItemContext] =
  createGuardedContext<OptionItemProps & ItemState>({
    hookName: "useMenuOptionItemContext",
    providerName: "<MenuItemContextProvider>",
    strict: true,
  })
