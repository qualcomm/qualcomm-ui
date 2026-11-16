// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  FilterPanelApplyTrigger,
  type FilterPanelApplyTriggerProps,
} from "./filter-panel-apply-trigger.js"
import {
  FilterPanelClearTrigger,
  type FilterPanelClearTriggerProps,
} from "./filter-panel-clear-trigger.js"
import {
  FilterPanelCloseTrigger,
  type FilterPanelCloseTriggerProps,
} from "./filter-panel-close-trigger.js"
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
  FilterPanelRoot,
  type FilterPanelRootProps,
} from "./filter-panel-root.js"
import {
  FilterPanelSection,
  type FilterPanelSectionProps,
} from "./filter-panel-section.js"

export * from "./qds-filter-panel-context.js"

export type {
  FilterPanelApplyTriggerProps,
  FilterPanelClearTriggerProps,
  FilterPanelCloseTriggerProps,
  FilterPanelFooterProps,
  FilterPanelHeaderProps,
  FilterPanelHeadingProps,
  FilterPanelRootProps,
  FilterPanelSectionProps,
}

type FilterPanelComponent = {
  /**
   * Commits the draft filters when clicked. Disabled when there are no pending
   * changes. Renders a `<button>` element by default.
   */
  ApplyTrigger: typeof FilterPanelApplyTrigger
  /**
   * Removes every filter when clicked. Disabled when no filters are set.
   * Renders a `<button>` element by default.
   */
  ClearTrigger: typeof FilterPanelClearTrigger
  /**
   * Closes the filter panel. Visibility is owned by the container, so handle
   * `onClick` or render it inside a container that provides closing behavior.
   * Renders a `<button>` element by default.
   */
  CloseTrigger: typeof FilterPanelCloseTrigger
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
   * The root element of the filter panel. Renders a `<div>` element by default.
   */
  Root: typeof FilterPanelRoot
  /**
   * A group of related filter controls within the filter panel. Renders a
   * `<div>` element by default.
   */
  Section: typeof FilterPanelSection
}

export const FilterPanel: FilterPanelComponent = {
  ApplyTrigger: FilterPanelApplyTrigger,
  ClearTrigger: FilterPanelClearTrigger,
  CloseTrigger: FilterPanelCloseTrigger,
  Footer: FilterPanelFooter,
  Header: FilterPanelHeader,
  Heading: FilterPanelHeading,
  Root: FilterPanelRoot,
  Section: FilterPanelSection,
}
