// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FilterSetApi} from "@qualcomm-ui/core/filter-set"
import type {FilterDefinitions} from "@qualcomm-ui/core/filters"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [FilterSetProvider, useFilterSetContext] = createGuardedContext<
  FilterSetApi<FilterDefinitions>
>({
  hookName: "useFilterSetContext",
  providerName: "<FilterSetProvider>",
  strict: true,
})
