// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {
  FilterDefinition,
  IdentifiedFilterDefinition,
} from "@qualcomm-ui/core/filters"
import {
  FilterPanel,
  type FilterPanelFilterContentProps,
  type FilterPanelFilterLabelProps,
  type FilterPanelFilterProps,
  type FilterPanelFilterTriggerProps,
} from "@qualcomm-ui/react/filter-panel"

/**
 * Props shared by every filter component.
 */
export interface FilterSectionProps<
  TDef extends FilterDefinition = FilterDefinition,
> {
  /**
   * Props applied to the content element.
   * @inheritDoc
   */
  contentProps?: FilterPanelFilterContentProps | undefined

  /**
   * Whether the filter is expanded initially.
   *
   * @default true
   */
  defaultOpen?: boolean | undefined

  /**
   * The filter's definition, from `defineFilters`.
   */
  filter: IdentifiedFilterDefinition<TDef>

  /**
   * Customizes how the label renders in this filter's section. Accepts a
   * `ReactNode`, or a function that receives the resolved string label. The
   * rendered label also names the filter's control. `getFilterLabel` and
   * value summaries keep the resolved string.
   */
  label?: FilterPanelFilterLabelProps["children"]

  /**
   * Called when the filter expands or collapses.
   */
  onOpenChange?: FilterPanelFilterProps["onOpenChange"]

  /**
   * The controlled expanded state.
   */
  open?: boolean | undefined

  /**
   * Props applied to the root element.
   * @inheritDoc
   */
  rootProps?: Omit<FilterPanelFilterProps, "filter"> | undefined

  /**
   * Props applied to the trigger element.
   * @inheritDoc
   */
  triggerProps?: FilterPanelFilterTriggerProps | undefined
}

export function FilterSection<TDef extends FilterDefinition>({
  children,
  contentProps,
  defaultOpen,
  filter,
  label,
  onOpenChange,
  open,
  rootProps,
  triggerProps,
}: FilterSectionProps<TDef> & {children: ReactNode}): ReactElement {
  return (
    <FilterPanel.Filter
      defaultOpen={defaultOpen}
      filter={filter}
      onOpenChange={onOpenChange}
      open={open}
      {...rootProps}
    >
      <FilterPanel.FilterTrigger {...triggerProps}>
        <FilterPanel.FilterLabel>{label}</FilterPanel.FilterLabel>
        <FilterPanel.FilterCount />
        <FilterPanel.FilterIndicator />
      </FilterPanel.FilterTrigger>
      <FilterPanel.FilterContent {...contentProps}>
        {children}
      </FilterPanel.FilterContent>
    </FilterPanel.Filter>
  )
}
