// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {Header, RowData} from "@qualcomm-ui/core/table"

import {flexRender} from "./flex-render"

interface Props<TData extends RowData = unknown, TValue = unknown> {
  footer: Header<TData, TValue>
}

export function RenderFooter({footer}: Props): ReactElement | null {
  return footer.isPlaceholder ? null : (
    <>{flexRender(footer.column.columnDef.footer, footer.getContext())}</>
  )
}
