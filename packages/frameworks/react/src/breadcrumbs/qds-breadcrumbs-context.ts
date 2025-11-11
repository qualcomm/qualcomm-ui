// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsBreadcrumbsApi} from "@qualcomm-ui/qds-core/breadcrumbs"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [QdsBreadcrumbsContextProvider, useQdsBreadcrumbsContext] =
  createGuardedContext<QdsBreadcrumbsApi>({
    hookName: "useQdsBreadcrumbsContext",
    providerName: "<QdsBreadcrumbsContextProvider>",
    strict: true,
  })
