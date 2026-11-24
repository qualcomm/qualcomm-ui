// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, inject, Injector, type Signal} from "@angular/core"

import {useMachine} from "@qualcomm-ui/angular-core/machine"
import {
  createFilterSetApi,
  type FilterSetApi,
  type FilterSetApiProps,
  filterSetMachine,
} from "@qualcomm-ui/core/filter-set"
import type {FilterDefinitions} from "@qualcomm-ui/core/filters"

/**
 * Creates the shared state of a set of filters. Pass it to
 * `q-filter-panel-root-provider` or `q-filter-set-provider` to share it with
 * filter controls and with content outside the controls, such as active filter
 * chips, or to keep a manual-mode draft while the controls are unmounted.
 *
 * Must be called in an injection context, such as a field initializer, unless
 * an `injector` is passed. Pass a signal to update the props after creation.
 * Resolvers such as `getFilterCollection` may read signals, such as a query's
 * data. The filter set updates when those signals change.
 */
export function useFilterSet<
  TDefs extends FilterDefinitions = FilterDefinitions,
>(
  props: FilterSetApiProps<TDefs> | Signal<FilterSetApiProps<TDefs>>,
  injector: Injector = inject(Injector),
): Signal<FilterSetApi<TDefs>> {
  const machine = useMachine(
    filterSetMachine,
    props as FilterSetApiProps | Signal<FilterSetApiProps>,
    injector,
  )
  return computed(() => {
    const api = createFilterSetApi<TDefs>(machine)
    /**
     * The API caches resolved collections and option counts for its lifetime.
     * React recreates the API on every render, but this signal only recomputes
     * when its dependencies change. Resolving every filter here makes the
     * signals that the resolvers read dependencies of the API, so new data
     * produces a new API instead of a stale cache entry.
     */
    for (const id of Object.keys(api.filters)) {
      api.getFilterCollection(id as never)
      api.getFilterOptionCounts(id)
    }
    return api
  })
}
