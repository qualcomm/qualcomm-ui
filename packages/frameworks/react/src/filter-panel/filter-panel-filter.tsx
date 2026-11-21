// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {FilterDefinition} from "@qualcomm-ui/core/filters"

import {
  FilterPanelFilterContent,
  type FilterPanelFilterContentProps,
} from "./filter-panel-filter-content.js"
import {
  FilterPanelFilterCount,
  type FilterPanelFilterCountProps,
} from "./filter-panel-filter-count.js"
import {
  FilterPanelFilterIndicator,
  type FilterPanelFilterIndicatorProps,
} from "./filter-panel-filter-indicator.js"
import {
  FilterPanelFilterLabel,
  type FilterPanelFilterLabelProps,
} from "./filter-panel-filter-label.js"
import {
  FilterPanelFilterRoot,
  type FilterPanelFilterRootProps,
} from "./filter-panel-filter-root.js"
import {
  FilterPanelFilterTrigger,
  type FilterPanelFilterTriggerProps,
} from "./filter-panel-filter-trigger.js"

export interface FilterPanelFilterProps<
  TDef extends FilterDefinition = FilterDefinition,
> extends FilterPanelFilterRootProps<TDef> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   * This is the filter's control, rendered in the content element.
   */
  children?: ReactNode

  /**
   * Props applied to the content element.
   * @inheritDoc
   */
  contentProps?: FilterPanelFilterContentProps | undefined

  /**
   * Props applied to the count element.
   * @inheritDoc
   */
  countProps?: FilterPanelFilterCountProps | undefined

  /**
   * Props applied to the indicator element.
   * @inheritDoc
   */
  indicatorProps?: FilterPanelFilterIndicatorProps | undefined

  /**
   * Customizes how the label renders. Accepts a `ReactNode`, or a function
   * that receives the resolved string label. The rendered label also names the
   * filter's control. `getFilterLabel` and value summaries keep the resolved
   * string.
   */
  label?: FilterPanelFilterLabelProps["children"]

  /**
   * Props applied to the label element.
   * @inheritDoc
   */
  labelProps?: FilterPanelFilterLabelProps | undefined

  /**
   * Props applied to the trigger element.
   * @inheritDoc
   */
  triggerProps?: FilterPanelFilterTriggerProps | undefined
}

/**
 * A collapsible filter section with a trigger that shows the filter's label,
 * count, and indicator. Its children are the filter's
 * control. Expanded by default. Renders a `<div>` element by default.
 */
export function FilterPanelFilter<TDef extends FilterDefinition>({
  children,
  contentProps,
  countProps,
  indicatorProps,
  label,
  labelProps,
  triggerProps,
  ...props
}: FilterPanelFilterProps<TDef>): ReactElement {
  return (
    <FilterPanelFilterRoot {...props}>
      <FilterPanelFilterTrigger {...triggerProps}>
        <FilterPanelFilterLabel {...labelProps}>
          {label ?? labelProps?.children}
        </FilterPanelFilterLabel>
        <FilterPanelFilterCount {...countProps} />
        <FilterPanelFilterIndicator {...indicatorProps} />
      </FilterPanelFilterTrigger>
      <FilterPanelFilterContent {...contentProps}>
        {children}
      </FilterPanelFilterContent>
    </FilterPanelFilterRoot>
  )
}
