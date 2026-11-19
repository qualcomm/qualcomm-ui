// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  FilterPanelApplyButton,
  type FilterPanelApplyButtonProps,
} from "./filter-panel-apply-button.js"
import {
  FilterPanelClearButton,
  type FilterPanelClearButtonProps,
} from "./filter-panel-clear-button.js"
import {
  FilterPanelCloseButton,
  type FilterPanelCloseButtonProps,
} from "./filter-panel-close-button.js"
import {
  FilterPanelCount,
  type FilterPanelCountProps,
} from "./filter-panel-count.js"
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
import {
  FilterPanelFilter,
  type FilterPanelFilterProps,
} from "./filter-panel-filter.js"
import {
  FilterPanelFooter,
  type FilterPanelFooterProps,
} from "./filter-panel-footer.js"
import {
  FilterPanelHeader,
  type FilterPanelHeaderProps,
} from "./filter-panel-header.js"
import {
  FilterPanelHeading,
  type FilterPanelHeadingProps,
} from "./filter-panel-heading.js"
import {
  FilterPanelRootProvider,
  type FilterPanelRootProviderProps,
} from "./filter-panel-root-provider.js"
import {
  FilterPanelRoot,
  type FilterPanelRootProps,
} from "./filter-panel-root.js"
import {
  FilterPanelSection,
  type FilterPanelSectionProps,
} from "./filter-panel-section.js"

export * from "./qds-filter-panel-context.js"

export type {
  FilterPanelApplyButtonProps,
  FilterPanelClearButtonProps,
  FilterPanelCloseButtonProps,
  FilterPanelCountProps,
  FilterPanelFilterProps,
  FilterPanelFilterContentProps,
  FilterPanelFilterCountProps,
  FilterPanelFilterIndicatorProps,
  FilterPanelFilterLabelProps,
  FilterPanelFilterRootProps,
  FilterPanelFilterTriggerProps,
  FilterPanelFooterProps,
  FilterPanelHeaderProps,
  FilterPanelHeadingProps,
  FilterPanelRootProps,
  FilterPanelRootProviderProps,
  FilterPanelSectionProps,
}

type FilterPanelComponent = {
  /**
   * Commits the draft filters when clicked. Disabled when there are no pending
   * changes. Renders a `<button>` element by default.
   */
  ApplyButton: typeof FilterPanelApplyButton
  /**
   * Removes every filter when clicked. Disabled when no filters are set.
   * Renders a `<button>` element by default.
   */
  ClearButton: typeof FilterPanelClearButton
  /**
   * Closes the filter panel. Visibility is owned by the container, so handle
   * `onClick` or render it inside a container that provides closing behavior.
   * Renders a `<button>` element by default.
   */
  CloseButton: typeof FilterPanelCloseButton
  /**
   * The total number of selected values in the panel. Hidden when no filters are
   * set. Renders a `<span>` element by default.
   */
  Count: typeof FilterPanelCount
  /**
   * A collapsible filter section with a trigger that shows the filter's label,
   * count, and indicator. Its children are the filter's control. Renders a
   * `<div>` element by default.
   */
  Filter: typeof FilterPanelFilter
  /**
   * The collapsible content of a filter. Renders a `<div>` element by default.
   */
  FilterContent: typeof FilterPanelFilterContent
  /**
   * The number of values selected in the filter. Hidden when the filter is
   * empty. Renders a `<span>` element by default.
   */
  FilterCount: typeof FilterPanelFilterCount
  /**
   * Indicates whether the filter is expanded. Renders a `<span>` element by
   * default.
   */
  FilterIndicator: typeof FilterPanelFilterIndicator
  /**
   * The filter's label. Accepts a `ReactNode`, or a function that receives the
   * resolved string label. Renders a `<span>` element by default.
   */
  FilterLabel: typeof FilterPanelFilterLabel
  /**
   * A collapsible filter section. Provides the filter's state to its trigger,
   * content, and control. Renders a `<div>` element by default. Intended to be
   * used with the composite elements:
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
  FilterRoot: typeof FilterPanelFilterRoot
  /**
   * Expands and collapses the filter's content. Renders a `<button>` element
   * by default.
   */
  FilterTrigger: typeof FilterPanelFilterTrigger
  /**
   * The footer of the filter panel. Renders a `<div>` element by default.
   */
  Footer: typeof FilterPanelFooter
  /**
   * The header of the filter panel. Renders a `<div>` element by default.
   */
  Header: typeof FilterPanelHeader
  /**
   * The title of the filter panel. Renders an `<h2>` element by default.
   */
  Heading: typeof FilterPanelHeading
  /**
   * The root element of the filter panel. Owns the panel's filter set. Renders
   * a `<div>` element by default.
   */
  Root: typeof FilterPanelRoot
  /**
   * The root element of a filter panel whose filter set was created with
   * `useFilterSet`. Renders a `<div>` element by default.
   */
  RootProvider: typeof FilterPanelRootProvider
  /**
   * A group of related filters within the filter panel. Renders a `<div>`
   * element by default.
   */
  Section: typeof FilterPanelSection
}

export const FilterPanel: FilterPanelComponent = {
  ApplyButton: FilterPanelApplyButton,
  ClearButton: FilterPanelClearButton,
  CloseButton: FilterPanelCloseButton,
  Count: FilterPanelCount,
  Filter: FilterPanelFilter,
  FilterContent: FilterPanelFilterContent,
  FilterCount: FilterPanelFilterCount,
  FilterIndicator: FilterPanelFilterIndicator,
  FilterLabel: FilterPanelFilterLabel,
  FilterRoot: FilterPanelFilterRoot,
  FilterTrigger: FilterPanelFilterTrigger,
  Footer: FilterPanelFooter,
  Header: FilterPanelHeader,
  Heading: FilterPanelHeading,
  Root: FilterPanelRoot,
  RootProvider: FilterPanelRootProvider,
  Section: FilterPanelSection,
}
