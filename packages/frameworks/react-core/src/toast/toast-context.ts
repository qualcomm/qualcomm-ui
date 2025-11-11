// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ToastApi} from "@qualcomm-ui/core/toast"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [ToastContextProvider, useToastContext] =
  createGuardedContext<ToastApi>({
    hookName: "useToastContext",
    providerName: "<ToastContextProvider>",
    strict: true,
  })
