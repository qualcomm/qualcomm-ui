// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createFilterPanelApi,
  type FilterPanelApi,
  type FilterPanelApplyTriggerBindings,
  type FilterPanelClearTriggerBindings,
  type FilterPanelCountBindings,
  type FilterPanelFilterIndicatorBindings,
} from "@qualcomm-ui/core/filter-panel"
import type {FilterSetApi} from "@qualcomm-ui/core/filter-set"
import {useCollapsibleContext} from "@qualcomm-ui/react-core/collapsible"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"

import {useFilterPanelContext} from "./filter-panel-context.js"

/**
 * Creates the filter panel's element bindings from a filter set.
 */
export function useFilterPanel(filterSet: FilterSetApi<any>): FilterPanelApi {
  return createFilterPanelApi(filterSet, normalizeProps)
}

export function useFilterPanelApplyTrigger(): FilterPanelApplyTriggerBindings {
  return useFilterPanelContext().getApplyTriggerBindings()
}

export function useFilterPanelClearTrigger(): FilterPanelClearTriggerBindings {
  return useFilterPanelContext().getClearTriggerBindings()
}

export function useFilterPanelCount(): FilterPanelCountBindings {
  return useFilterPanelContext().getCountBindings()
}

export function useFilterPanelFilterIndicator(): FilterPanelFilterIndicatorBindings {
  const {open} = useCollapsibleContext()
  return useFilterPanelContext().getFilterIndicatorBindings({open})
}
