// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createFilterSetApi,
  type FilterSetApi,
  type FilterSetApiProps,
  filterSetMachine,
} from "@qualcomm-ui/core/filter-set"
import type {FilterDefinitions} from "@qualcomm-ui/core/filters"
import {useMachine} from "@qualcomm-ui/react-core/machine"

/**
 * Creates the shared state of a set of filters. Pass it to
 * `FilterPanel.RootProvider` or `FilterSetProvider` to share it with filter
 * controls and with content outside the controls, such as active filter
 * chips, or to keep a manual-mode draft while the controls are unmounted.
 */
export function useFilterSet<
  TDefs extends FilterDefinitions = FilterDefinitions,
>(props: FilterSetApiProps<TDefs> = {}): FilterSetApi<TDefs> {
  const machine = useMachine(filterSetMachine, props as FilterSetApiProps)
  return createFilterSetApi<TDefs>(machine)
}
