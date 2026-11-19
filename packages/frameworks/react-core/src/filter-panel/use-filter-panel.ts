// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createFilterPanelApi,
  type FilterPanelApi,
  type FilterPanelApplyTriggerBindings,
  type FilterPanelClearTriggerBindings,
} from "@qualcomm-ui/core/filter-panel"
import type {FilterSetApi} from "@qualcomm-ui/core/filter-set"
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
