// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableHeaderProps extends ElementRenderProp<"thead"> {}

/**
 * The table header section containing column headers. Renders a `<thead>` element
 * by default.
 *
 * @example
 * ```tsx
 * <Table.Table>
 *   <Table.Header>
 *     <Table.Row>
 *       <Table.HeaderCell>
 *         ...
 *       </Table.HeaderCell>
 *     </Table.Row>
 *   </Table.Header>
 * </Table.Table>
 * ```
 */
export function TableHeader(props: TableHeaderProps): ReactElement {
  const mergedProps = mergeProps(qdsTableApi.getHeaderBindings(), props)

  return <PolymorphicElement as="thead" {...mergedProps} />
}
