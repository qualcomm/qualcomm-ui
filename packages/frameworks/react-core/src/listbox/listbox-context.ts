// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ListboxApi} from "@qualcomm-ui/core/listbox"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [ListboxContextProvider, useListboxContext] =
  createGuardedContext<ListboxApi>({
    hookName: "useListboxContext",
    providerName: "<ListboxContextProvider>",
    strict: true,
  })
