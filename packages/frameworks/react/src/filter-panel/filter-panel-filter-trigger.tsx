// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreFilterPanel,
  type CoreFilterPanelFilterTriggerProps,
} from "@qualcomm-ui/react-core/filter-panel"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {FilterPanelFilterCount} from "./filter-panel-filter-count.js"
import {FilterPanelFilterIndicator} from "./filter-panel-filter-indicator.js"
import {FilterPanelFilterLabel} from "./filter-panel-filter-label.js"
import {useQdsFilterPanelContext} from "./qds-filter-panel-context.js"

export interface FilterPanelFilterTriggerProps extends CoreFilterPanelFilterTriggerProps {}

/**
 * Expands and collapses the filter's content. Renders the filter's label,
 * count, and indicator when no children are provided. Renders a `<button>`
 * element by default.
 */
export function FilterPanelFilterTrigger({
  children,
  ...props
}: FilterPanelFilterTriggerProps): ReactElement {
  const qdsContext = useQdsFilterPanelContext()

  const mergedProps = mergeProps(qdsContext.getFilterTriggerBindings(), props)

  return (
    <CoreFilterPanel.FilterTrigger {...mergedProps}>
      {children ?? (
        <>
          <FilterPanelFilterLabel />
          <FilterPanelFilterCount />
          <FilterPanelFilterIndicator />
        </>
      )}
    </CoreFilterPanel.FilterTrigger>
  )
}
