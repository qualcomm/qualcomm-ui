// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FilterSetApi} from "@qualcomm-ui/core/filter-set"
import type {FilterDefinitions} from "@qualcomm-ui/core/filters"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

/**
 * Holds the filter set of any set of definitions. `useFilterSetContext`
 * restores the definitions' types.
 */
const [FilterSetProvider, useFilterSetContextValue] = createGuardedContext<
  FilterSetApi<any>
>({
  hookName: "useFilterSetContext",
  providerName: "<FilterSetProvider>",
  strict: true,
})

export {FilterSetProvider}

/**
 * Returns the surrounding filter set. Pass the type of the filter definitions,
 * `useFilterSetContext<typeof filters>()`, to type the filter ids and values.
 */
export function useFilterSetContext<
  TDefs extends FilterDefinitions = FilterDefinitions,
>(): FilterSetApi<TDefs> {
  return useFilterSetContextValue()
}
