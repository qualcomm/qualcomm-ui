// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {QdsTableRowProps} from "@qualcomm-ui/qds-core/table"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableRowProps
  extends ElementRenderProp<"tr">,
    QdsTableRowProps {}

/**
 * A table row. Renders a `<tr>` element by default.
 *
 * @example
 * ```tsx
 * <Table.Body>
 *   {table.getRowModel().rows.map((row) => (
 *     <Table.Row key={row.id} isSelected={row.getIsSelected()}>
 *       {row.getVisibleCells().map((cell) => (
 *         <Table.Cell key={cell.id}>...</Table.Cell>
 *       ))}
 *     </Table.Row>
 *   ))}
 * </Table.Body>
 * ```
 */
export function TableRow({
  isDragging,
  isDraggingOver,
  isSelected,
  ...props
}: TableRowProps): ReactElement {
  const mergedProps = mergeProps(
    qdsTableApi.getRowBindings({
      isDragging,
      isDraggingOver,
      isSelected,
    }),
    props,
  )

  return <PolymorphicElement as="tr" {...mergedProps} />
}
