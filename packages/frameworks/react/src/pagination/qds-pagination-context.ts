// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsPaginationApi} from "@qualcomm-ui/qds-core/pagination"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsPaginationContextProvider, useQdsPaginationContext] =
  createGuardedContext<QdsPaginationApi>({
    hookName: "useQdsPaginationContext",
    providerName: "<QdsPaginationContextProvider>",
    strict: true,
  })
