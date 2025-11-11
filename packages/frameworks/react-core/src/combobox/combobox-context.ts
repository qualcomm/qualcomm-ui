// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComboboxApi} from "@qualcomm-ui/core/combobox"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [ComboboxContextProvider, useComboboxContext] =
  createGuardedContext<ComboboxApi>({
    hookName: "useComboboxContext",
    providerName: "<ComboboxContextProvider>",
    strict: true,
  })
