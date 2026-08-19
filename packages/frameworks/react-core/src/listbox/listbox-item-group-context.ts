// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ListboxItemGroupApiProps} from "@qualcomm-ui/core/listbox"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [ListboxItemGroupContextProvider, useListboxItemGroupContext] =
  createGuardedContext<ListboxItemGroupApiProps>({
    hookName: "useListboxItemGroupContext",
    providerName: "<ListboxItemGroupContextProvider>",
    strict: true,
  })
