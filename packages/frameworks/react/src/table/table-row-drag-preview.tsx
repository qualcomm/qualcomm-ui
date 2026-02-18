// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {Row} from "@qualcomm-ui/core/table"
import {Portal} from "@qualcomm-ui/react-core/portal"

import {flexRender} from "./dynamic-render"
import {qdsTableApi} from "./qds-table-context"

export interface TableRowDragPreviewProps {
  container?: HTMLElement
  row: Row<any>
}

/**
 * `container` uses a Portal for libs that need it (e.g., pragmatic-dnd)
 * otherwise content is directly rendered (e.g., dnd-kit's DragOverlay)
 */
export function TableRowDragPreview({
  container,
  row,
}: TableRowDragPreviewProps): ReactElement {
  const content = (
    <div {...qdsTableApi.getRowDragPreviewBindings()}>
      {row.getVisibleCells().map((cell) => (
        <div key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      ))}
    </div>
  )

  return container ? <Portal container={container}>{content}</Portal> : content
}
