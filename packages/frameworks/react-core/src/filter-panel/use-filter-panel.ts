// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createFilterPanelApi,
  type FilterPanelApi,
  type FilterPanelApiProps,
  type FilterPanelApplyTriggerBindings,
  type FilterPanelClearTriggerBindings,
  filterPanelMachine,
} from "@qualcomm-ui/core/filter-panel"
import type {
  FilterDefinition,
  FilterDefinitions,
  IdentifiedFilterDefinition,
} from "@qualcomm-ui/core/filters"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"

import {useFilterPanelContext} from "./filter-panel-context.js"
import {
  type FilterPanelFilterContextValue,
  useFilterPanelFilterContext,
} from "./filter-panel-filter-context.js"

/**
 * Creates a filter panel API for use with `FilterPanel.RootProvider`. Hoist
 * the panel's state this way to share it with content outside the panel, such
 * as active filter chips, or to keep a manual-mode draft while the panel is
 * unmounted.
 */
export function useFilterPanel<
  TDefinitions extends FilterDefinitions = FilterDefinitions,
>(props: FilterPanelApiProps<TDefinitions> = {}): FilterPanelApi<TDefinitions> {
  const machine = useMachine(filterPanelMachine, props as FilterPanelApiProps)
  return createFilterPanelApi<TDefinitions>(machine, normalizeProps)
}

export function useFilterPanelApplyTrigger(): FilterPanelApplyTriggerBindings {
  return useFilterPanelContext().getApplyTriggerBindings()
}

export function useFilterPanelClearTrigger(): FilterPanelClearTriggerBindings {
  return useFilterPanelContext().getClearTriggerBindings()
}

/**
 * Builds the state of one filter from the surrounding filter panel.
 */
export function useFilterPanelFilterState<TDefinition extends FilterDefinition>(
  definition: IdentifiedFilterDefinition<TDefinition>,
  labelId: string,
): FilterPanelFilterContextValue<TDefinition> {
  const api = useFilterPanelContext()
  const {id} = definition
  return {
    clear: () => api.clearFilter(id),
    count: api.getFilterValueCount(id),
    definition,
    id,
    isActive: api.isFilterActive(id),
    label: api.getFilterLabel(id),
    labelId,
    setValue: (value, details) => api.setFilterValue(id, value, details),
    value: api.getFilterValue(
      id,
    ) as FilterPanelFilterContextValue<TDefinition>["value"],
  }
}

/**
 * Returns the state of the surrounding filter. Use inside `FilterPanel.Filter`
 * to build a custom filter control.
 */
export function useFilterPanelFilter<
  TDefinition extends FilterDefinition = FilterDefinition,
>(): FilterPanelFilterContextValue<TDefinition> {
  return useFilterPanelFilterContext() as unknown as FilterPanelFilterContextValue<TDefinition>
}
