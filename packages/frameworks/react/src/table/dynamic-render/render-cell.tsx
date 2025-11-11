// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {Cell, RowData} from "@qualcomm-ui/core/table"

import {flexRender} from "./flex-render"

interface Props<TData extends RowData = unknown, TValue = unknown> {
  cell: Cell<TData, TValue>
}

export function RenderCell({cell}: Props): ReactElement | null {
  return cell.getIsPlaceholder() ? null : (
    <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
  )
}
