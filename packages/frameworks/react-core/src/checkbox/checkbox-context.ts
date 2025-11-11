// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {CheckboxApi} from "@qualcomm-ui/core/checkbox"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export interface CheckboxContextValue extends CheckboxApi {}

export const [CheckboxContextProvider, useCheckboxContext] =
  createGuardedContext<CheckboxContextValue>({
    hookName: "useCheckboxContext",
    providerName: "<CheckboxContextProvider>",
    strict: true,
  })
