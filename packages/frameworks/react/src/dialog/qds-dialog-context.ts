// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsDialogApi} from "@qualcomm-ui/qds-core/dialog"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsDialogContextProvider, useQdsDialogContext] =
  createGuardedContext<QdsDialogApi>({
    hookName: "useQdsDialogContext",
    providerName: "<QdsDialogContextProvider>",
    strict: true,
  })
