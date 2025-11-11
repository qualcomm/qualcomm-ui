// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {Header} from "@qualcomm-ui/core/table"
import {Portal} from "@qualcomm-ui/react-core/portal"

import {flexRender} from "./dynamic-render"
import {qdsTableApi} from "./qds-table-context"

export interface TableColumnDragPreviewProps {
  container: HTMLElement
  header: Header<any>
}

/**
 * Preview element displayed when dragging a column. Renders content in a portal.
 */
export function TableColumnDragPreview({
  container,
  header,
}: TableColumnDragPreviewProps): ReactElement {
  return (
    <Portal container={container}>
      <div {...qdsTableApi.getColumnDragPreviewBindings()}>
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </div>
    </Portal>
  )
}
