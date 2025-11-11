// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsSelectApi} from "@qualcomm-ui/qds-core/select"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsComboboxContextProvider, useQdsComboboxContext] =
  createGuardedContext<QdsSelectApi>({
    hookName: "useQdsComboboxContext",
    providerName: "<QdsComboboxContextProvider>",
    strict: true,
  })
