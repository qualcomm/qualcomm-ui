// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {QdsTableCellProps} from "@qualcomm-ui/qds-core/table"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableCellProps
  extends ElementRenderProp<"td">,
    QdsTableCellProps {}

/**
 * A data cell within a table row. Renders a `<td>` element by default.
 *
 * @example
 * ```tsx
 * <Table.Body>
 *   <Table.Row>
 *     <Table.Cell>...</Table.Cell>
 *   </Table.Row>
 * </Table.Body>
 * ```
 */
export function TableCell({cell, ...props}: TableCellProps): ReactElement {
  const mergedProps = mergeProps(qdsTableApi.getCellBindings({cell}), props)

  return <PolymorphicElement as="td" {...mergedProps} />
}
