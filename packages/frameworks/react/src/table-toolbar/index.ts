// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  TableToolbarEnd,
  type TableToolbarEndProps,
} from "./table-toolbar-end.js"
import {
  TableToolbarRoot,
  type TableToolbarRootProps,
} from "./table-toolbar-root.js"
import {
  TableToolbarStart,
  type TableToolbarStartProps,
} from "./table-toolbar-start.js"

export type {
  TableToolbarEndProps,
  TableToolbarRootProps,
  TableToolbarStartProps,
}

type TableToolbarComponent = {
  /**
   * Groups controls aligned to the end of the toolbar, such as view options and
   * primary actions. Renders a `<div>` element by default.
   */
  End: typeof TableToolbarEnd
  /**
   * The root element of the toolbar. Must be rendered within a `Table.Root`.
   * Buttons rendered inside the toolbar inherit a size derived from the table
   * size. Renders a `<div>` element by default.
   */
  Root: typeof TableToolbarRoot
  /**
   * Groups controls aligned to the start of the toolbar, such as filters.
   * Renders a `<div>` element by default.
   */
  Start: typeof TableToolbarStart
}

export const TableToolbar: TableToolbarComponent = {
  End: TableToolbarEnd,
  Root: TableToolbarRoot,
  Start: TableToolbarStart,
}
