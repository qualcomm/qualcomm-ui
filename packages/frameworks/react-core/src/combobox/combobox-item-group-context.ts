// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComboboxApiItemGroupProps} from "@qualcomm-ui/core/combobox"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [ComboboxItemGroupContextProvider, useComboboxItemGroupContext] =
  createGuardedContext<ComboboxApiItemGroupProps>({
    hookName: "useComboboxItemGroupContext",
    providerName: "<ComboboxItemGroupContextProvider>",
    strict: true,
  })
