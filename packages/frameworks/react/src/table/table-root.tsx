// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  createQdsTableRootApi,
  type QdsTableApiProps,
} from "@qualcomm-ui/qds-core/table"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsTableRootContextProvider} from "./qds-table-root-context.js"

export interface TableRootProps
  extends ElementRenderProp<"div">, QdsTableApiProps {}

/**
 * The root element that wraps the table. Renders a `<div>` element by default.
 *
 * @example
 * ```tsx
 * <Table.Root>
 *   <TableToolbar.Root>...</TableToolbar.Root>
 *   <Table.ScrollContainer>
 *     <Table.Table>...</Table.Table>
 *   </Table.ScrollContainer>
 *   <Table.Pagination {...paginationProps}>
 *     // pagination controls
 *   </Table.Pagination>
 * </Table.Root>
 * ```
 */
export function TableRoot({
  showColumnDivider,
  size,
  ...props
}: TableRootProps): ReactElement {
  const rootApi = createQdsTableRootApi(
    {showColumnDivider, size},
    normalizeProps,
  )
  const mergedProps = mergeProps(rootApi.getRootBindings(), props)

  return (
    <QdsTableRootContextProvider value={rootApi}>
      <PolymorphicElement as="div" {...mergedProps} />
    </QdsTableRootContextProvider>
  )
}
