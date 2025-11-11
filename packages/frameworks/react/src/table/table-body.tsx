// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableBodyProps extends ElementRenderProp<"tbody"> {}

/**
 * The table body section containing data rows. Renders a `<tbody>` element by
 * default.
 *
 * @example
 * ```tsx
 * <Table.Table>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>
 *       </Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table.Table>
 * ```
 */
export function TableBody(props: TableBodyProps): ReactElement {
  const mergedProps = mergeProps(qdsTableApi.getBodyBindings(), props)

  return <PolymorphicElement as="tbody" {...mergedProps} />
}
