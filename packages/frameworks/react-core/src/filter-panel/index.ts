// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  CoreFilterPanelApplyTrigger,
  type CoreFilterPanelApplyTriggerProps,
  CoreFilterPanelClearTrigger,
  type CoreFilterPanelClearTriggerProps,
  CoreFilterPanelFilterContent,
  type CoreFilterPanelFilterContentProps,
  CoreFilterPanelFilterCount,
  type CoreFilterPanelFilterCountProps,
  CoreFilterPanelFilterLabel,
  type CoreFilterPanelFilterLabelProps,
  CoreFilterPanelFilterRoot,
  type CoreFilterPanelFilterRootProps,
  CoreFilterPanelFilterTrigger,
  type CoreFilterPanelFilterTriggerProps,
  CoreFilterPanelRoot,
  type CoreFilterPanelRootProps,
  CoreFilterPanelRootProvider,
  type CoreFilterPanelRootProviderProps,
} from "./core-filter-panel.js"

export * from "./filter-panel-context.js"
export * from "./use-filter-panel.js"

export type {
  CoreFilterPanelApplyTriggerProps,
  CoreFilterPanelClearTriggerProps,
  CoreFilterPanelFilterContentProps,
  CoreFilterPanelFilterCountProps,
  CoreFilterPanelFilterLabelProps,
  CoreFilterPanelFilterRootProps,
  CoreFilterPanelFilterTriggerProps,
  CoreFilterPanelRootProps,
  CoreFilterPanelRootProviderProps,
}

type CoreFilterPanelComponent = {
  ApplyTrigger: typeof CoreFilterPanelApplyTrigger
  ClearTrigger: typeof CoreFilterPanelClearTrigger
  FilterContent: typeof CoreFilterPanelFilterContent
  FilterCount: typeof CoreFilterPanelFilterCount
  FilterLabel: typeof CoreFilterPanelFilterLabel
  FilterRoot: typeof CoreFilterPanelFilterRoot
  FilterTrigger: typeof CoreFilterPanelFilterTrigger
  Root: typeof CoreFilterPanelRoot
  RootProvider: typeof CoreFilterPanelRootProvider
}

export const CoreFilterPanel: CoreFilterPanelComponent = {
  ApplyTrigger: CoreFilterPanelApplyTrigger,
  ClearTrigger: CoreFilterPanelClearTrigger,
  FilterContent: CoreFilterPanelFilterContent,
  FilterCount: CoreFilterPanelFilterCount,
  FilterLabel: CoreFilterPanelFilterLabel,
  FilterRoot: CoreFilterPanelFilterRoot,
  FilterTrigger: CoreFilterPanelFilterTrigger,
  Root: CoreFilterPanelRoot,
  RootProvider: CoreFilterPanelRootProvider,
}
