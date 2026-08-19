// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ListboxItemApiProps} from "@qualcomm-ui/core/listbox"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [ListboxItemContextProvider, useListboxItemContext] =
  createGuardedContext<ListboxItemApiProps>({
    hookName: "useListboxItemContext",
    providerName: "<ListboxItemContextProvider>",
    strict: true,
  })
