// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {Row} from "@qualcomm-ui/core/table"
import {Portal} from "@qualcomm-ui/react-core/portal"

import {flexRender} from "./dynamic-render"
import {qdsTableApi} from "./qds-table-context"

export interface TableRowDragPreviewProps {
  container: HTMLElement
  row: Row<any>
}

/**
 * Preview element displayed when dragging a row. Renders content in a portal.
 */
export function TableRowDragPreview({
  container,
  row,
}: TableRowDragPreviewProps): ReactElement {
  return (
    <Portal container={container}>
      <div {...qdsTableApi.getRowDragPreviewBindings()}>
        {row.getVisibleCells().map((cell) => (
          <div key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        ))}
      </div>
    </Portal>
  )
}
