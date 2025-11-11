// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsToastApi} from "@qualcomm-ui/qds-core/toast"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsToastContextProvider, useQdsToastContext] =
  createGuardedContext<QdsToastApi>({
    hookName: "useQdsToastContext",
    providerName: "<QdsToastContextProvider>",
    strict: true,
  })
