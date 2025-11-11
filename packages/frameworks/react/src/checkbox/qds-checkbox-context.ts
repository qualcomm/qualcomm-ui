// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsCheckboxApi} from "@qualcomm-ui/qds-core/checkbox"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsCheckboxContextProvider, useQdsCheckboxContext] =
  createGuardedContext<QdsCheckboxApi>({
    hookName: "useQdsCheckboxContext",
    providerName: "<QdsCheckboxContextProvider>",
    strict: true,
  })
