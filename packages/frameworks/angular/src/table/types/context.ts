import type {InputSignal} from "@angular/core"

import type {
  CellContext,
  ColumnMeta,
  HeaderContext,
} from "@qualcomm-ui/core/table"

export interface CellComponentContext<
  TData extends object,
  TValue = any,
  TColumnMeta = ColumnMeta,
> {
  context:
    | CellContext<TData, TValue, TColumnMeta>
    | InputSignal<CellContext<TData, TValue, TColumnMeta>>
}

export interface HeaderComponentContext<
  TData extends object,
  TValue = any,
  TColumnMeta = ColumnMeta,
> {
  context:
    | HeaderContext<TData, TValue, TColumnMeta>
    | InputSignal<HeaderContext<TData, TValue, TColumnMeta>>
}
