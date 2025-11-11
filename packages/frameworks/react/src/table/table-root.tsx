// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {QdsTableApiProps} from "@qualcomm-ui/qds-core/table"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableRootProps
  extends ElementRenderProp<"div">,
    QdsTableApiProps {}

/**
 * The root element that wraps the table. Renders a `<div>` element by default.
 *
 * @example
 * ```tsx
 * <Table.Root>
 *   <Table.ActionBar>...</Table.ActionBar>
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
  const mergedProps = mergeProps(
    qdsTableApi.getRootBindings({
      showColumnDivider,
      size,
    } satisfies Explicit<QdsTableApiProps>),
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}
