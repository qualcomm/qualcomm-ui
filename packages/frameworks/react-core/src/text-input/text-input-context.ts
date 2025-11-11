// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TextInputApi} from "@qualcomm-ui/core/text-input"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [TextInputContextProvider, useTextInputContext] =
  createGuardedContext<TextInputApi>({
    hookName: "useTextInputContext",
    providerName: "<TextInputContextProvider>",
    strict: true,
  })
