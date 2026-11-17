// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {FilterDefinition} from "@qualcomm-ui/core/filters"
import {
  CoreFilterPanel,
  type CoreFilterPanelFilterProps,
} from "@qualcomm-ui/react-core/filter-panel"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.js"

export interface FilterPanelFilterProps<
  TDefinition extends FilterDefinition = FilterDefinition,
> extends CoreFilterPanelFilterProps<TDefinition> {}

/**
 * A collapsible filter section. Provides the filter's state to its trigger,
 * content, and control. Expanded by default. Renders a `<div>` element by
 * default.
 */
export function FilterPanelFilter<TDefinition extends FilterDefinition>(
  props: FilterPanelFilterProps<TDefinition>,
): ReactElement {
  const qdsContext = useQdsFilterPanelContext()

  const mergedProps = mergeProps(qdsContext.getFilterBindings(), props)
  return <CoreFilterPanel.Filter {...mergedProps} />
}
