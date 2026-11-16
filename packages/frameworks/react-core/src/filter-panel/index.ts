// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  CoreFilterPanelApplyTrigger,
  type CoreFilterPanelApplyTriggerProps,
  CoreFilterPanelClearTrigger,
  type CoreFilterPanelClearTriggerProps,
  CoreFilterPanelRoot,
  type CoreFilterPanelRootProps,
} from "./core-filter-panel.js"

export * from "./filter-panel-context.js"
export * from "./use-filter-panel.js"

export type {
  CoreFilterPanelApplyTriggerProps,
  CoreFilterPanelClearTriggerProps,
  CoreFilterPanelRootProps,
}

type CoreFilterPanelComponent = {
  ApplyTrigger: typeof CoreFilterPanelApplyTrigger
  ClearTrigger: typeof CoreFilterPanelClearTrigger
  Root: typeof CoreFilterPanelRoot
}

export const CoreFilterPanel: CoreFilterPanelComponent = {
  ApplyTrigger: CoreFilterPanelApplyTrigger,
  ClearTrigger: CoreFilterPanelClearTrigger,
  Root: CoreFilterPanelRoot,
}
