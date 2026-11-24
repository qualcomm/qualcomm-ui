// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
  type UseContextOpts,
} from "@qualcomm-ui/angular-core/machine"
import type {FilterSetApi} from "@qualcomm-ui/core/filter-set"
import type {FilterDefinitions} from "@qualcomm-ui/core/filters"

/**
 * Holds the filter set of any set of definitions. `useFilterSetContext`
 * restores the definitions' types.
 */
@Injectable()
export class FilterSetContextService extends BaseApiContextService<
  FilterSetApi<any>
> {}

const [
  FILTER_SET_CONTEXT,
  useFilterSetContextValue,
  provideFilterSetContext,
]: ApiContext<FilterSetApi<any>> = createApiContext<FilterSetApi<any>>(
  "FilterSetContext",
  FilterSetContextService,
)

export {FILTER_SET_CONTEXT, provideFilterSetContext}

/**
 * Returns the surrounding filter set. Pass the type of the filter definitions,
 * `useFilterSetContext<typeof filters>()`, to type the filter ids and values.
 * Must be called in an injection context, such as a field initializer.
 */
export function useFilterSetContext<
  TDefs extends FilterDefinitions = FilterDefinitions,
>(): () => FilterSetApi<TDefs>
export function useFilterSetContext<
  TDefs extends FilterDefinitions = FilterDefinitions,
>(opts: UseContextOpts<true>): (() => FilterSetApi<TDefs>) | null
export function useFilterSetContext<
  TDefs extends FilterDefinitions = FilterDefinitions,
>(opts?: UseContextOpts<boolean>): (() => FilterSetApi<TDefs>) | null {
  return useFilterSetContextValue(opts)
}
