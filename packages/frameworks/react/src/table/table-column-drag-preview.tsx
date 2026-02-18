// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {Header} from "@qualcomm-ui/core/table"
import {Portal} from "@qualcomm-ui/react-core/portal"

import {flexRender} from "./dynamic-render"
import {qdsTableApi} from "./qds-table-context"

export interface TableColumnDragPreviewProps {
  container?: HTMLElement
  header: Header<any>
}

/**
 * `container` uses a Portal for libs that need it (e.g., pragmatic-dnd)
 * otherwise content is directly rendered (e.g., dnd-kit's DragOverlay)
 */
export function TableColumnDragPreview({
  container,
  header,
}: TableColumnDragPreviewProps): ReactElement {
  const content = (
    <div {...qdsTableApi.getColumnDragPreviewBindings()}>
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </div>
  )

  return container ? <Portal container={container}>{content}</Portal> : content
}
