// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {QdsFilterPanelApiProps} from "@qualcomm-ui/qds-core/filter-panel"
import {
  CoreFilterPanel,
  type CoreFilterPanelRootProviderProps,
} from "@qualcomm-ui/react-core/filter-panel"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  QdsFilterPanelProviders,
  useQdsFilterPanel,
} from "./filter-panel-root.js"

export interface FilterPanelRootProviderProps
  extends CoreFilterPanelRootProviderProps, QdsFilterPanelApiProps {}

/**
 * The root element of a filter panel whose filter set was created with
 * `useFilterSet`. Renders a `<div>` element by default.
 */
export function FilterPanelRootProvider({
  size,
  ...props
}: FilterPanelRootProviderProps): ReactElement {
  const qdsContext = useQdsFilterPanel(size)

  return (
    <QdsFilterPanelProviders value={qdsContext}>
      <CoreFilterPanel.RootProvider
        {...mergeProps(qdsContext.getRootBindings(), props)}
      />
    </QdsFilterPanelProviders>
  )
}
