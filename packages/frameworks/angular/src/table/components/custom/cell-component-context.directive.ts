import {Directive, input} from "@angular/core"

import type {CellContext, ColumnMeta} from "@qualcomm-ui/core/table"

import type {CellComponentContext} from "../../types"

@Directive()
export class CellComponentContextDirective<
  TableData extends object,
  ColumnValue = any,
  TableColumnMeta = ColumnMeta,
> implements CellComponentContext<TableData, ColumnValue, TableColumnMeta>
{
  readonly context =
    input.required<CellContext<TableData, ColumnValue, TableColumnMeta>>()
}
