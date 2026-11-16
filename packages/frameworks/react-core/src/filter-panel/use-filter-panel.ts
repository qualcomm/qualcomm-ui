// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FilterPanelClearTriggerBindings} from "@qualcomm-ui/core/filter-panel"

import {useFilterPanelContext} from "./filter-panel-context.js"

export function useFilterPanelClearTrigger(): FilterPanelClearTriggerBindings {
  return useFilterPanelContext().getClearTriggerBindings()
}
