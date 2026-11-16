// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  TableFilterPanelHeader,
  type TableFilterPanelHeaderProps,
} from "./table-filter-panel-header.js"
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
  TableFilterPanelRootProps,
  TableFilterPanelSectionProps,
}

type TableFilterPanelComponent = {
  /**
   * The header of the filter panel. Renders a `<div>` element by default.
   */
  Header: typeof TableFilterPanelHeader
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
  Root: TableFilterPanelRoot,
  Section: TableFilterPanelSection,
}
