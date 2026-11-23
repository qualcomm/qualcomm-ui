// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreFilterPanel,
  type CoreFilterPanelFilterLabelProps,
} from "@qualcomm-ui/react-core/filter-panel"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.js"

export interface FilterPanelFilterLabelProps extends CoreFilterPanelFilterLabelProps {}

/**
 * The filter's label. Renders the resolved label by default. Pass a
 * `ReactNode`, or a function that receives the resolved string, to customize
 * it. Renders a `<span>` element by default.
 */
export function FilterPanelFilterLabel(
  props: FilterPanelFilterLabelProps,
): ReactElement {
  const qdsContext = useQdsFilterPanelContext()

  const mergedProps = mergeProps(qdsContext.getFilterLabelBindings(), props)
  return <CoreFilterPanel.FilterLabel {...mergedProps} />
}
