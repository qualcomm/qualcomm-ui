// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsTourApi} from "@qualcomm-ui/qds-core/tour"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsTourContextProvider, useQdsTourContext] =
  createGuardedContext<QdsTourApi>({
    hookName: "useQdsTourContext",
    providerName: "<QdsTourContextProvider>",
    strict: true,
  })
