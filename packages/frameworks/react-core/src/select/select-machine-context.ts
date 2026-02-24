// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {SelectSchema} from "@qualcomm-ui/core/select"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"
import type {Machine} from "@qualcomm-ui/utils/machine"

export const [SelectMachineContextProvider, useSelectMachineContext] =
  createGuardedContext<Machine<SelectSchema>>({
    hookName: "useSelectMachineContext",
    providerName: "<SelectMachineContextProvider>",
    strict: true,
  })
