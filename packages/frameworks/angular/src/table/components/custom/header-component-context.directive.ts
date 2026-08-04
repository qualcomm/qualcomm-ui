// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, input} from "@angular/core"

import type {ColumnMeta, HeaderContext} from "@qualcomm-ui/core/table"

import type {HeaderComponentContext} from "../../types"

@Directive()
export class HeaderComponentContextDirective<
  TableData extends object,
  ColumnValue = any,
  TableColumnMeta = ColumnMeta,
> implements HeaderComponentContext<TableData, ColumnValue, TableColumnMeta> {
  readonly context =
    input.required<HeaderContext<TableData, ColumnValue, TableColumnMeta>>()
}
