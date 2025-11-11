// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PaginationApi} from "@qualcomm-ui/core/pagination"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [PaginationContextProvider, usePaginationContext] =
  createGuardedContext<PaginationApi>({
    hookName: "usePaginationContext",
    providerName: "<PaginationContextProvider>",
    strict: true,
  })
