// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableTableProps extends ElementRenderProp<"table"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * The actual table element. Renders a `<table>` element by default.
 *
 * @example
 * ```tsx
 * <Table.Root>
 *   <Table.ScrollContainer>
 *     <Table.Table>
 *       <Table.Header>...</Table.Header>
 *       <Table.Body>...</Table.Body>
 *       <Table.Footer>...</Table.Footer>
 *     </Table.Table>
 *   </Table.ScrollContainer>
 * </Table.Root>
 * ```
 */
export function TableTable(props: TableTableProps): ReactElement {
  const mergedProps = mergeProps(qdsTableApi.getTableBindings(), props)

  return <PolymorphicElement as="table" {...mergedProps} />
}
