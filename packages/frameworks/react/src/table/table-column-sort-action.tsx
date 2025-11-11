// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ArrowDownUp, ArrowUp} from "lucide-react"

import type {Header} from "@qualcomm-ui/core/table"
import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsTableApi} from "./qds-table-context"

export interface TableColumnSortActionProps
  extends Omit<ElementRenderProp<"button">, "children"> {
  header: Header<any>
}

/**
 * An action button for sorting a column. Automatically displays the appropriate
 * sort icon based on the column's sort state. Renders a `<button>` element by
 * default.
 */
export function TableColumnSortAction({
  header,
  ...props
}: TableColumnSortActionProps): ReactElement | null {
  const sortDirection = header.column.getIsSorted()
  const canSort = header.column.getCanSort()

  if (!canSort) {
    return null
  }

  const mergedProps = mergeProps(
    qdsTableApi.getColumnSortActionBindings({header}),
    props,
  )

  return (
    <InlineIconButton
      icon={sortDirection ? ArrowUp : ArrowDownUp}
      size="sm"
      variant="fixed"
      {...mergedProps}
    />
  )
}
