// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  TableFilterBarClearTrigger,
  type TableFilterBarClearTriggerProps,
} from "./table-filter-bar-clear-trigger.js"
import {
  TableFilterBarExpandTrigger,
  type TableFilterBarExpandTriggerProps,
} from "./table-filter-bar-expand-trigger.js"
import {
  TableFilterBarFilterList,
  type TableFilterBarFilterListProps,
} from "./table-filter-bar-filter-list.js"
import {
  TableFilterBarRoot,
  type TableFilterBarRootProps,
} from "./table-filter-bar-root.js"

export interface TableFilterBarProps extends Omit<
  TableFilterBarRootProps,
  "children"
> {
  /**
   * Props applied to the clear trigger component.
   *
   * @inheritDoc
   */
  clearTriggerProps?: TableFilterBarClearTriggerProps

  /**
   * Props applied to the expand trigger component.
   *
   * @inheritDoc
   */
  expandTriggerProps?: TableFilterBarExpandTriggerProps

  /**
   * Props applied to the filter list component.
   *
   * @inheritDoc
   */
  filterListProps?: Omit<TableFilterBarFilterListProps, "children">
}

export function TableFilterBar({
  clearTriggerProps,
  expandTriggerProps,
  filterListProps,
  ...props
}: TableFilterBarProps): ReactElement {
  return (
    <TableFilterBarRoot {...props}>
      <TableFilterBarFilterList {...filterListProps}>
        <TableFilterBarExpandTrigger {...expandTriggerProps} />
      </TableFilterBarFilterList>
      <TableFilterBarClearTrigger {...clearTriggerProps} />
    </TableFilterBarRoot>
  )
}
