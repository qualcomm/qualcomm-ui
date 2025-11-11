// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {Header} from "@qualcomm-ui/core/table"

import {flexRender} from "./flex-render"

interface Props<TData extends object, TValue = unknown> {
  header: Header<TData, TValue>
}

export function RenderHeader({header}: Props<any>): ReactElement | null {
  return header.isPlaceholder ? null : (
    <>{flexRender(header.column.columnDef.header, header.getContext())}</>
  )
}
