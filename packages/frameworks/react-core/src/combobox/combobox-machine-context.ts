// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComboboxSchema} from "@qualcomm-ui/core/combobox"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"
import type {Machine} from "@qualcomm-ui/utils/machine"

export const [ComboboxMachineContextProvider, useComboboxMachineContext] =
  createGuardedContext<Machine<ComboboxSchema>>({
    hookName: "useComboboxMachineContext",
    providerName: "<ComboboxMachineContextProvider>",
    strict: true,
  })
