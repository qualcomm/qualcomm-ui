// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {FilterDefinition} from "@qualcomm-ui/core/filters"
import {
  CoreFilterPanel,
  type CoreFilterPanelFilterRootProps,
} from "@qualcomm-ui/react-core/filter-panel"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.js"

export interface FilterPanelFilterRootProps<
  TDef extends FilterDefinition = FilterDefinition,
> extends CoreFilterPanelFilterRootProps<TDef> {}

/**
 * A collapsible filter section. Provides the filter's state to its trigger,
 * content, and control. Expanded by default. Renders a `<div>` element by
 * default. Intended to be used with the composite elements:
 *
 * @example
 * ```tsx
 * <FilterPanel.FilterRoot filter={filters.status}>
 *   <FilterPanel.FilterTrigger>
 *     <FilterPanel.FilterLabel />
 *     <FilterPanel.FilterCount />
 *     <FilterPanel.FilterIndicator />
 *   </FilterPanel.FilterTrigger>
 *   <FilterPanel.FilterContent>
 *     <CheckboxGroupFilter />
 *   </FilterPanel.FilterContent>
 * </FilterPanel.FilterRoot>
 * ```
 */
export function FilterPanelFilterRoot<TDef extends FilterDefinition>(
  props: FilterPanelFilterRootProps<TDef>,
): ReactElement {
  const qdsContext = useQdsFilterPanelContext()

  const mergedProps = mergeProps(qdsContext.getFilterBindings(), props)
  return <CoreFilterPanel.FilterRoot {...mergedProps} />
}
