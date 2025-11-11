// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Pagination, type PaginationRootProps} from "@qualcomm-ui/react/pagination"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TablePaginationProps extends PaginationRootProps {}

/**
 * Wrapper for pagination controls. This is a convenience component that wraps
 * `Pagination.Root` with table-specific styling and bindings.
 *
 * @example
 * ```tsx
 * import {Pagination} from "@qualcomm-ui/react/pagination"
 * import {useTablePagination, Table} from "@qualcomm-ui/react/table"
 *
 * const paginationProps = useTablePagination(table)
 *
 * <Table.Root>
 *   <Table.ScrollContainer>...</Table.ScrollContainer>
 *   <Table.Pagination {...paginationProps}>
 *     <Pagination.PageMetadata>
 *       {({pageStart, pageEnd, count}) => `${pageStart}-${pageEnd} of ${count}`}
 *     </Pagination.PageMetadata>
 *     <Pagination.PageButtons />
 *   </Table.Pagination>
 * </Table.Root>
 * ```
 */
export function TablePagination({
  ...props
}: TablePaginationProps): ReactElement {
  const mergedProps = mergeProps(qdsTableApi.getPaginationBindings(), props)
  return <Pagination.Root {...mergedProps} />
}
