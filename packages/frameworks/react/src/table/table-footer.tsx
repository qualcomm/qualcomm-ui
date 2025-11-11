// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableFooterProps extends ElementRenderProp<"tfoot"> {}

/**
 * The table footer section. Renders a `<tfoot>` element by default.
 *
 * @example
 * ```tsx
 * <Table.Table>
 *   <Table.Header>...</Table.Header>
 *   <Table.Body>...</Table.Body>
 *   <Table.Footer>
 *     <Table.Row>
 *       <Table.Cell>...</Table.Cell>
 *     </Table.Row>
 *   </Table.Footer>
 * </Table.Table>
 * ```
 */
export function TableFooter(props: TableFooterProps): ReactElement {
  const mergedProps = mergeProps(qdsTableApi.getFooterBindings(), props)

  return <PolymorphicElement as="tfoot" {...mergedProps} />
}
