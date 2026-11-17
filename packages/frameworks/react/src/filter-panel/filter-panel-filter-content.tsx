// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreFilterPanel,
  type CoreFilterPanelFilterContentProps,
} from "@qualcomm-ui/react-core/filter-panel"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.js"

export interface FilterPanelFilterContentProps extends CoreFilterPanelFilterContentProps {}

/**
 * The collapsible content of a filter. Renders a `<div>` element by default.
 */
export function FilterPanelFilterContent(
  props: FilterPanelFilterContentProps,
): ReactElement | null {
  const qdsContext = useQdsFilterPanelContext()

  const mergedProps = mergeProps(qdsContext.getFilterContentBindings(), props)
  return <CoreFilterPanel.FilterContent {...mergedProps} />
}
