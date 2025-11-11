// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {CellContext, CoreCell} from "./core/cell"
import type {CoreColumn} from "./core/column"
import type {
  CoreHeader,
  CoreHeaderGroup,
  HeaderContext,
  HeadersInstance,
} from "./core/headers"
import type {CoreRow} from "./core/row"
import type {CoreInstance, CoreOptions, CoreTableState} from "./core/table"
import type {
  ColumnSizingColumn,
  ColumnSizingColumnDef,
  ColumnSizingHeader,
  ColumnSizingInstance,
  ColumnSizingOptions,
  ColumnSizingTableState,
} from "./features/column-sizing"
import type {
  ExpandedInstance,
  ExpandedOptions,
  ExpandedRow,
  ExpandedTableState,
} from "./features/expanding"
import type {
  FiltersColumn,
  FiltersColumnDef,
  FiltersInstance,
  FiltersOptions,
  FiltersRow,
  FiltersTableState,
} from "./features/filters"
import type {
  GroupingCell,
  GroupingColumn,
  GroupingColumnDef,
  GroupingInstance,
  GroupingOptions,
  GroupingRow,
  GroupingTableState,
} from "./features/grouping"
import type {
  ColumnOrderInstance,
  ColumnOrderOptions,
  ColumnOrderTableState,
} from "./features/ordering"
import type {
  PaginationInitialTableState,
  PaginationInstance,
  PaginationOptions,
  PaginationTableState,
} from "./features/pagination"
import type {
  ColumnPinningColumn,
  ColumnPinningColumnDef,
  ColumnPinningInstance,
  ColumnPinningOptions,
  ColumnPinningRow,
  ColumnPinningTableState,
  RowPinningInstance,
  RowPinningOptions,
  RowPinningRow,
  RowPinningTableState,
} from "./features/pinning"
import type {
  RowSelectionInstance,
  RowSelectionOptions,
  RowSelectionRow,
  RowSelectionTableState,
} from "./features/row-selection"
import type {
  SortingColumn,
  SortingColumnDef,
  SortingInstance,
  SortingOptions,
  SortingTableState,
} from "./features/sorting"
import type {
  VisibilityColumn as ColumnVisibilityColumn,
  VisibilityColumnDef,
  VisibilityInstance,
  VisibilityOptions,
  VisibilityRow,
  VisibilityTableState,
} from "./features/visibility"
import type {PartialKeys, UnionToIntersection} from "./utils"

export interface TableMeta<_TData extends RowData> {}

export interface ColumnMeta {}

export interface FilterMeta {}

export interface FilterFns {}

export interface SortingFns {}

export interface AggregationFns {}

export type Updater<T> = T | ((old: T) => T)
export type OnChangeFn<T> = (updaterOrValue: Updater<T>) => void

export type RowData = unknown | object | any[]

export type AnyRender = (Comp: any, props: any) => any

export interface TableInstance<TData extends RowData>
  extends CoreInstance<TData>,
    HeadersInstance<TData>,
    VisibilityInstance<TData>,
    ColumnOrderInstance<TData>,
    ColumnPinningInstance<TData>,
    RowPinningInstance<TData>,
    FiltersInstance<TData>,
    SortingInstance<TData>,
    GroupingInstance<TData>,
    ColumnSizingInstance,
    ExpandedInstance<TData>,
    PaginationInstance<TData>,
    RowSelectionInstance<TData> {}

interface FeatureOptions<TData extends RowData>
  extends VisibilityOptions,
    ColumnOrderOptions,
    ColumnPinningOptions,
    RowPinningOptions<TData>,
    FiltersOptions<TData>,
    SortingOptions<TData>,
    GroupingOptions,
    ExpandedOptions<TData>,
    ColumnSizingOptions,
    PaginationOptions,
    RowSelectionOptions<TData> {}

export type TableOptionsResolved<TData extends RowData> = CoreOptions<TData> &
  FeatureOptions<TData>

export interface TableOptions<TData extends RowData>
  extends PartialKeys<
    TableOptionsResolved<TData>,
    "state" | "onStateChange" | "renderFallbackValue"
  > {}

export interface TableState
  extends CoreTableState,
    VisibilityTableState,
    ColumnOrderTableState,
    ColumnPinningTableState,
    RowPinningTableState,
    FiltersTableState,
    SortingTableState,
    ExpandedTableState,
    GroupingTableState,
    ColumnSizingTableState,
    PaginationTableState,
    RowSelectionTableState {}

interface CompleteInitialTableState
  extends CoreTableState,
    VisibilityTableState,
    ColumnOrderTableState,
    ColumnPinningTableState,
    RowPinningTableState,
    FiltersTableState,
    SortingTableState,
    ExpandedTableState,
    GroupingTableState,
    ColumnSizingTableState,
    PaginationInitialTableState,
    RowSelectionTableState {}

export interface InitialTableState extends Partial<CompleteInitialTableState> {}

export interface Row<TData extends RowData>
  extends CoreRow<TData>,
    VisibilityRow<TData>,
    ColumnPinningRow<TData>,
    RowPinningRow,
    FiltersRow<TData>,
    GroupingRow,
    RowSelectionRow,
    ExpandedRow {}

export interface RowModel<TData extends RowData> {
  /** @inheritDoc */
  flatRows: Row<TData>[]
  /** @inheritDoc */
  rows: Row<TData>[]
  /** @inheritDoc */
  rowsById: Record<string, Row<TData>>
}

export type AccessorFn<TData extends RowData, TValue = unknown> = (
  originalRow: TData,
  index: number,
) => TValue

export type ColumnDefTemplate<TProps extends object> =
  | string
  | ((props: TProps) => any)

export interface StringHeaderIdentifier {
  /**
   * Header definition.
   */
  header: string
  id?: string
}

export interface IdIdentifier<TData extends RowData, TValue> {
  /**
   * Header definition.
   */
  header?: ColumnDefTemplate<HeaderContext<TData, TValue>>
  id: string
}

type ColumnIdentifiers<TData extends RowData, TValue> =
  | IdIdentifier<TData, TValue>
  | StringHeaderIdentifier

interface ColumnDefExtensions<TData extends RowData, TValue = unknown>
  extends VisibilityColumnDef,
    ColumnPinningColumnDef,
    FiltersColumnDef<TData>,
    SortingColumnDef<TData>,
    GroupingColumnDef<TData, TValue>,
    ColumnSizingColumnDef {}

export interface ColumnDefBase<
  TData extends RowData,
  TValue = unknown,
  TColumnMeta = ColumnMeta,
> extends ColumnDefExtensions<TData, TValue> {
  cell?: ColumnDefTemplate<CellContext<TData, TValue, TColumnMeta>>
  footer?: ColumnDefTemplate<HeaderContext<TData, TValue, TColumnMeta>>
  getUniqueValues?: AccessorFn<TData, unknown[]>
  /**
   * Column Meta
   */
  meta?: TColumnMeta
}

export interface IdentifiedColumnDef<TData extends RowData, TValue = unknown>
  extends ColumnDefBase<TData, TValue> {
  /**
   * Header definition.
   *
   * @inheritDoc
   */
  header?: ColumnDefTemplate<HeaderContext<TData, TValue>>

  /**
   * ID
   */
  id?: string
}

export type DisplayColumnDef<
  TData extends RowData,
  TValue = unknown,
  TColumnMeta = ColumnMeta,
> = ColumnDefBase<TData, TValue, TColumnMeta> & ColumnIdentifiers<TData, TValue>

interface GroupColumnDefBase<
  TData extends RowData,
  TValue = unknown,
  TColumnMeta = ColumnMeta,
> extends ColumnDefBase<TData, TValue, TColumnMeta> {
  columns?: ColumnDef<TData, any>[]
}

export type GroupColumnDef<
  TData extends RowData,
  TValue = unknown,
  TColumnMeta = ColumnMeta,
> = GroupColumnDefBase<TData, TValue, TColumnMeta> &
  ColumnIdentifiers<TData, TValue>

interface AccessorFnColumnDefBase<
  TData extends RowData,
  TValue = unknown,
  TColumnMeta = ColumnMeta,
> extends ColumnDefBase<TData, TValue, TColumnMeta> {
  accessorFn: AccessorFn<TData, TValue>
}

export type AccessorFnColumnDef<
  TData extends RowData,
  TValue = unknown,
  TColumnMeta = ColumnMeta,
> = AccessorFnColumnDefBase<TData, TValue, TColumnMeta> &
  ColumnIdentifiers<TData, TValue>

export interface AccessorKeyColumnDefBase<
  TData extends RowData,
  TValue = unknown,
  TColumnMeta = ColumnMeta,
> extends ColumnDefBase<TData, TValue, TColumnMeta> {
  /**
   * Key
   */
  accessorKey: string | keyof TData

  /**
   * ID of the column
   */
  id?: string
}

/**
 * @interface
 */
export type AccessorKeyColumnDef<
  TData extends RowData,
  TValue = unknown,
  TColumnMeta = ColumnMeta,
> = AccessorKeyColumnDefBase<TData, TValue, TColumnMeta> &
  Partial<ColumnIdentifiers<TData, TValue>>

/**
 * @interface
 */
export type AccessorColumnDef<
  TData extends RowData,
  TValue = unknown,
  TColumnMeta = ColumnMeta,
> =
  | AccessorKeyColumnDef<TData, TValue, TColumnMeta>
  | AccessorFnColumnDef<TData, TValue, TColumnMeta>

/**
 * @interface
 */
export type ColumnDef<
  TData extends RowData,
  TValue = unknown,
  TColumnMeta = ColumnMeta,
> =
  | DisplayColumnDef<TData, TValue, TColumnMeta>
  | GroupColumnDef<TData, TValue, TColumnMeta>
  | AccessorColumnDef<TData, TValue, TColumnMeta>

/**
 * @interface
 */
export type ColumnDefResolved<
  TData extends RowData,
  TValue = unknown,
> = Partial<UnionToIntersection<ColumnDef<TData, TValue>>> & {
  accessorKey?: string
}

export interface Column<
  TData extends RowData,
  TValue = unknown,
  TColumnMeta = ColumnMeta,
> extends CoreColumn<TData, TValue, TColumnMeta>,
    ColumnVisibilityColumn,
    ColumnPinningColumn,
    FiltersColumn<TData>,
    SortingColumn<TData>,
    GroupingColumn<TData>,
    ColumnSizingColumn {}

export interface Cell<
  TData extends RowData,
  TValue = unknown,
  TColumnMeta = ColumnMeta,
> extends CoreCell<TData, TValue, TColumnMeta>,
    GroupingCell {}

export interface Header<
  TData extends RowData,
  TValue = unknown,
  TColumnMeta = ColumnMeta,
> extends CoreHeader<TData, TValue, TColumnMeta>,
    ColumnSizingHeader {}

export interface HeaderGroup<TData extends RowData>
  extends CoreHeaderGroup<TData> {}
