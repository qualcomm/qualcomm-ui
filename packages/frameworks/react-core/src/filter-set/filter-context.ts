// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FilterState} from "@qualcomm-ui/core/filter-set"
import type {FilterDefinition} from "@qualcomm-ui/core/filters"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export interface FilterContextValue<
  TDef extends FilterDefinition = FilterDefinition,
> extends FilterState<TDef> {}

export const [FilterContextProvider, useFilterContext] =
  createGuardedContext<FilterContextValue>({
    hookName: "useFilter",
    providerName: "<FilterProvider>",
    strict: true,
  })
