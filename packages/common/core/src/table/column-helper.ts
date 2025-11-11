// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  AccessorFn,
  ColumnDef,
  DisplayColumnDef,
  GroupColumnDef,
  IdentifiedColumnDef,
  RowData,
} from "./types"
import type {DeepKeys, DeepValue} from "./utils"

export type ColumnHelper<TData extends RowData> = {
  accessor: <
    TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
    TValue extends TAccessor extends AccessorFn<TData, infer TReturn>
      ? TReturn
      : TAccessor extends DeepKeys<TData>
        ? DeepValue<TData, TAccessor>
        : never,
  >(
    accessor: TAccessor,
    column: TAccessor extends AccessorFn<TData>
      ? DisplayColumnDef<TData, TValue>
      : IdentifiedColumnDef<TData, TValue>,
  ) => ColumnDef<TData, TValue>
  display: (column: DisplayColumnDef<TData>) => ColumnDef<TData, unknown>
  group: (column: GroupColumnDef<TData>) => ColumnDef<TData, unknown>
}

export function createColumnHelper<
  TData extends RowData,
>(): ColumnHelper<TData> {
  return {
    accessor: (accessor, column) => {
      return typeof accessor === "function"
        ? ({
            ...column,
            accessorFn: accessor,
          } as any)
        : {
            ...column,
            accessorKey: accessor,
          }
    },
    display: (column) => column as ColumnDef<TData, unknown>,
    group: (column) => column as ColumnDef<TData, unknown>,
  }
}
