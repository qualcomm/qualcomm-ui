// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsNumberInputApi} from "@qualcomm-ui/qds-core/number-input"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsNumberInputContextProvider, useQdsNumberInputContext] =
  createGuardedContext<QdsNumberInputApi>({
    hookName: "useQdsNumberInputContext",
    providerName: "<QdsNumberInputContextProvider>",
    strict: true,
  })
