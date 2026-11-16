// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  TableFilterPanelHeader,
  type TableFilterPanelHeaderProps,
} from "./table-filter-panel-header.js"
import {
  TableFilterPanelHeading,
  type TableFilterPanelHeadingProps,
} from "./table-filter-panel-heading.js"
import {
  TableFilterPanelRoot,
  type TableFilterPanelRootProps,
} from "./table-filter-panel-root.js"
import {
  TableFilterPanelSection,
  type TableFilterPanelSectionProps,
} from "./table-filter-panel-section.js"

export type {
  TableFilterPanelHeaderProps,
  TableFilterPanelHeadingProps,
  TableFilterPanelRootProps,
  TableFilterPanelSectionProps,
}

type TableFilterPanelComponent = {
  /**
   * The header of the filter panel. Renders a `<div>` element by default.
   */
  Header: typeof TableFilterPanelHeader
  /**
   * The title of the filter panel. Renders an `<h2>` element by default.
   */
  Heading: typeof TableFilterPanelHeading
  /**
   * The root element of the filter panel. Must be rendered within a
   * `Table.Root`. Renders a `<div>` element by default.
   */
  Root: typeof TableFilterPanelRoot
  /**
   * A group of related filter controls within the filter panel. Renders a
   * `<div>` element by default.
   */
  Section: typeof TableFilterPanelSection
}

export const TableFilterPanel: TableFilterPanelComponent = {
  Header: TableFilterPanelHeader,
  Heading: TableFilterPanelHeading,
  Root: TableFilterPanelRoot,
  Section: TableFilterPanelSection,
}
