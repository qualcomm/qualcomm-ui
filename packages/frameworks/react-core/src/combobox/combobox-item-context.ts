// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComboboxItemContext} from "@qualcomm-ui/core/combobox"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [ComboboxItemContextProvider, useComboboxItemContext] =
  createGuardedContext<ComboboxItemContext>({
    hookName: "useComboboxItemContext",
    providerName: "<ComboboxItemContextProvider>",
    strict: true,
  })
