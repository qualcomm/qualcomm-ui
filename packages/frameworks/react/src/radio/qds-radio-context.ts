// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsRadioApi} from "@qualcomm-ui/qds-core/radio"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsRadioContextProvider, useQdsRadioContext] =
  createGuardedContext<QdsRadioApi>({
    hookName: "useQdsRadioContext",
    providerName: "<QdsRadioContextProvider>",
    strict: true,
  })
