// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DialogApi} from "@qualcomm-ui/core/dialog"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [DialogContextProvider, useDialogContext] =
  createGuardedContext<DialogApi>({
    hookName: "useDialogContext",
    providerName: "<DialogContextProvider>",
    strict: true,
  })
