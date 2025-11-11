// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {NumberInputApi} from "@qualcomm-ui/core/number-input"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [NumberInputContextProvider, useNumberInputContext] =
  createGuardedContext<NumberInputApi>({
    hookName: "useNumberInputContext",
    providerName: "<NumberInputContextProvider>",
    strict: true,
  })
