// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {RadioApi, RadioItemContext} from "@qualcomm-ui/core/radio"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [RadioItemContextProvider, useRadioItemContext] =
  createGuardedContext<RadioItemContext>({
    hookName: "useRadioContext",
    providerName: "<RadioContextProvider>",
    strict: true,
  })

export const [RadioContextProvider, useRadioContext] =
  createGuardedContext<RadioApi>({
    hookName: "useRadioContext",
    providerName: "<RadioContextProvider>",
    strict: true,
  })
