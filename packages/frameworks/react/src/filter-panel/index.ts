// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  FilterPanelClearTrigger,
  type FilterPanelClearTriggerProps,
} from "./filter-panel-clear-trigger.js"
import {
  FilterPanelCloseTrigger,
  type FilterPanelCloseTriggerProps,
} from "./filter-panel-close-trigger.js"
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
  FilterPanelClearTriggerProps,
  FilterPanelCloseTriggerProps,
  FilterPanelHeaderProps,
  FilterPanelHeadingProps,
  FilterPanelRootProps,
  FilterPanelSectionProps,
}

type FilterPanelComponent = {
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
  ClearTrigger: FilterPanelClearTrigger,
  CloseTrigger: FilterPanelCloseTrigger,
  Header: FilterPanelHeader,
  Heading: FilterPanelHeading,
  Root: FilterPanelRoot,
  Section: FilterPanelSection,
}
