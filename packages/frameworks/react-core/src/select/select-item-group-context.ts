// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ItemGroupProps} from "@qualcomm-ui/core/select"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [SelectItemGroupContextProvider, useSelectItemGroupContext] =
  createGuardedContext<ItemGroupProps>({
    hookName: "useSelectItemGroupContext",
    providerName: "<SelectItemGroupContextProvider>",
    strict: true,
  })
