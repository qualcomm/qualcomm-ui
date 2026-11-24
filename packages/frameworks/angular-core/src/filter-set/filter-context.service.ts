// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {FilterState} from "@qualcomm-ui/core/filter-set"
import type {FilterDefinition} from "@qualcomm-ui/core/filters"

/**
 * Holds one filter's state. The state is `undefined` when the provider
 * received no filter definition, in which case the filter's parts and controls
 * render nothing.
 */
@Injectable()
export class FilterContextService extends BaseApiContextService<
  FilterState | undefined
> {}

const [FILTER_CONTEXT, useFilterContextValue, provideFilterContext]: ApiContext<
  FilterState | undefined
> = createApiContext<FilterState | undefined>(
  "FilterContext",
  FilterContextService,
)

export {FILTER_CONTEXT, provideFilterContext}

/**
 * Returns the state of the surrounding filter. Use inside `q-filter-provider`
 * or a filter panel filter to build a custom filter control. Must be called in
 * an injection context, such as a field initializer.
 *
 * Returns `undefined` when the filter has no definition, so guard the
 * control's template with `@if (filter(); as filter)`.
 */
export function useFilter<
  TDef extends FilterDefinition = FilterDefinition,
>(): () => FilterState<TDef> | undefined {
  return useFilterContextValue() as () => FilterState<TDef> | undefined
}
