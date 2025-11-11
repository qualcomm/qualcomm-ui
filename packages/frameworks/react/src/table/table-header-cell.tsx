// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {QdsTableHeaderCellProps} from "@qualcomm-ui/qds-core/table"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableHeaderCellProps
  extends ElementRenderProp<"th">,
    QdsTableHeaderCellProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A header cell within the header row. Renders a `<th>` element by default.
 *
 * @example
 * ```tsx
 * <Table.Header>
 *   <Table.Row>
 *     {headerGroup.headers.map((header) => (
 *       <Table.HeaderCell key={header.id}>
 *         {flexRender(header.column.columnDef.header, header.getContext())}
 *       </Table.HeaderCell>
 *     ))}
 *   </Table.Row>
 * </Table.Header>
 * ```
 */
export function TableHeaderCell({
  columnIndex,
  isDragging,
  isDraggingOver,
  isResizing,
  ...props
}: TableHeaderCellProps): ReactElement {
  const mergedProps = mergeProps(
    qdsTableApi.getHeaderCellBindings({
      columnIndex,
      isDragging,
      isDraggingOver,
      isResizing,
    }),
    props,
  )

  return <PolymorphicElement as="th" {...mergedProps} />
}
