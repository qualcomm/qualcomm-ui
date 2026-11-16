// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  CoreFilterPanelClearTrigger,
  type CoreFilterPanelClearTriggerProps,
  CoreFilterPanelRoot,
  type CoreFilterPanelRootProps,
} from "./core-filter-panel.js"

export * from "./filter-panel-context.js"
export * from "./use-filter-panel.js"

export type {CoreFilterPanelClearTriggerProps, CoreFilterPanelRootProps}

type CoreFilterPanelComponent = {
  ClearTrigger: typeof CoreFilterPanelClearTrigger
  Root: typeof CoreFilterPanelRoot
}

export const CoreFilterPanel: CoreFilterPanelComponent = {
  ClearTrigger: CoreFilterPanelClearTrigger,
  Root: CoreFilterPanelRoot,
}
