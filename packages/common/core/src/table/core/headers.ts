// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  Column,
  ColumnMeta,
  Header,
  HeaderGroup,
  RowData,
  TableInstance,
} from "../types"
import {memo} from "../utils"

import type {TableFeature} from "./table"

export interface CoreHeaderGroup<TData extends RowData> {
  depth: number
  headers: Header<TData, unknown>[]
  id: string
}

export interface HeaderContext<TData, TValue, TColumnMeta = ColumnMeta> {
  /**
   * An instance of a column.
   *
   * @inheritDoc
   */
  column: Column<TData, TValue, TColumnMeta>

  /**
   * An instance of a header.
   *
   * @inheritDoc
   */
  header: Header<TData, TValue, TColumnMeta>

  /**
   * The table instance.
   *
   * @inheritDoc
   */
  table: TableInstance<TData>
}

export interface CoreHeader<
  TData extends RowData,
  TValue,
  TColumnMeta = ColumnMeta,
> {
  /**
   * The {@link https://www.w3schools.com/tags/att_colspan.asp colspan} for the header.
   */
  colSpan: number

  /**
   * The header's associated column object.
   *
   * @inheritDoc
   */
  column: Column<TData, TValue, TColumnMeta>

  /**
   * The depth of the header, zero-indexed based.
   */
  depth: number

  /**
   * Returns the rendering context (or props) for column-based components like
   * headers, footers and filters.
   */
  getContext: () => HeaderContext<TData, TValue, TColumnMeta>

  /**
   * Returns the leaf headers hierarchically nested under this header.
   *
   * @inheritDoc
   */
  getLeafHeaders: () => Header<TData, any, TColumnMeta>[]

  /**
   * The header's associated header group object.
   *
   * @inheritDoc
   */
  headerGroup: HeaderGroup<TData>

  /**
   * The unique identifier for the header.
   */
  id: string

  /**
   * The index for the header within the header group.
   */
  index: number

  /**
   * A boolean denoting if the header is a placeholder header.
   */
  isPlaceholder: boolean

  /**
   * If the header is a placeholder header, this will be a unique header ID that
   * does not conflict with any other headers across the table.
   */
  placeholderId?: string

  /**
   * The row-span for the header.
   */
  rowSpan: number

  /**
   * The header's hierarchical sub/child headers. Will be empty if the header's
   * associated column is a leaf-column.
   *
   * @inheritDoc
   */
  subHeaders: Header<TData, TValue, TColumnMeta>[]
}

export interface HeadersInstance<TData extends RowData> {
  /**
   * If pinning, returns headers for all columns that are not pinned, including
   * parent headers.
   *
   * @inheritDoc
   */
  getCenterFlatHeaders: () => Header<TData>[]

  /**
   * If pinning, returns the footer groups for columns that are not pinned.
   *
   * @inheritDoc
   */
  getCenterFooterGroups: () => HeaderGroup<TData>[]

  /**
   * If pinning, returns the header groups for columns that are not pinned.
   *
   * @inheritDoc
   */
  getCenterHeaderGroups: () => HeaderGroup<TData>[]

  /**
   * If pinning, returns headers for all columns that are not pinned, (not including
   * parent headers).
   *
   * @inheritDoc
   */
  getCenterLeafHeaders: () => Header<TData>[]

  /**
   * Returns headers for all columns in the table, including parent headers.
   *
   * @inheritDoc
   */
  getFlatHeaders: () => Header<TData>[]

  /**
   * Returns the footer groups for the table.
   *
   * @inheritDoc
   */
  getFooterGroups: () => HeaderGroup<TData>[]

  /**
   * Returns all header groups for the table.
   *
   * @inheritDoc
   */
  getHeaderGroups: () => HeaderGroup<TData>[]

  /**
   * Returns headers for all leaf columns in the table, (not including parent
   * headers).
   *
   * @inheritDoc
   */
  getLeafHeaders: () => Header<TData>[]

  /**
   * If pinning, returns headers for all left pinned columns in the table, including
   * parent headers.
   *
   * @inheritDoc
   */
  getLeftFlatHeaders: () => Header<TData>[]

  /**
   * If pinning, returns the footer groups for the left pinned columns.
   *
   * @inheritDoc
   */
  getLeftFooterGroups: () => HeaderGroup<TData>[]

  /**
   * If pinning, returns the header groups for the left pinned columns.
   *
   * @inheritDoc
   */
  getLeftHeaderGroups: () => HeaderGroup<TData>[]

  /**
   * If pinning, returns headers for all left pinned leaf columns in the table, (not
   * including parent headers).
   *
   * @inheritDoc
   */
  getLeftLeafHeaders: () => Header<TData>[]

  /**
   * If pinning, returns headers for all right pinned columns in the table,
   * including parent headers.
   *
   * @inheritDoc
   */
  getRightFlatHeaders: () => Header<TData>[]

  /**
   * If pinning, returns the footer groups for the right pinned columns.
   *
   * @inheritDoc
   */
  getRightFooterGroups: () => HeaderGroup<TData>[]

  /**
   * If pinning, returns the header groups for the right pinned columns.
   *
   * @inheritDoc
   */
  getRightHeaderGroups: () => HeaderGroup<TData>[]

  /**
   * If pinning, returns headers for all right pinned leaf columns in the table,
   * (not including parent headers).
   *
   * @inheritDoc
   */
  getRightLeafHeaders: () => Header<TData>[]
}

function createHeader<TData extends RowData, TValue, TColumnMeta = ColumnMeta>(
  table: TableInstance<TData>,
  column: Column<TData, TValue, TColumnMeta>,
  options: {
    depth: number
    id?: string
    index: number
    isPlaceholder?: boolean
    placeholderId?: string
  },
): Header<TData, TValue, TColumnMeta> {
  const id = options.id ?? column.id

  const header: CoreHeader<TData, TValue, TColumnMeta> = {
    colSpan: 0,
    column,
    depth: options.depth,
    getContext: () => ({
      column,
      header: header as Header<TData, TValue, TColumnMeta>,
      table,
    }),
    getLeafHeaders: (): Header<TData, unknown, TColumnMeta>[] => {
      const leafHeaders: Header<TData, unknown, TColumnMeta>[] = []

      const recurseHeader = (h: CoreHeader<TData, any, TColumnMeta>) => {
        if (h.subHeaders && h.subHeaders.length) {
          h.subHeaders.map(recurseHeader)
        }
        leafHeaders.push(h as Header<TData, unknown, TColumnMeta>)
      }

      recurseHeader(header)

      return leafHeaders
    },
    headerGroup: null!,
    id,
    index: options.index,
    isPlaceholder: !!options.isPlaceholder,
    placeholderId: options.placeholderId,
    rowSpan: 0,
    subHeaders: [],
  }

  table._features.forEach((feature) => {
    feature.createHeader?.(header, table)
  })

  return header as Header<TData, TValue, TColumnMeta>
}

export const Headers: TableFeature = {
  createTable: <TData extends RowData>(table: TableInstance<TData>): void => {
    // Header Groups

    table.getHeaderGroups = memo(
      () => [
        table.getAllColumns(),
        table.getVisibleLeafColumns(),
        table.getState().columnPinning.left,
        table.getState().columnPinning.right,
      ],
      (allColumns, leafColumns, left, right) => {
        const leftColumns =
          left
            ?.map((columnId) => leafColumns.find((d) => d.id === columnId)!)
            .filter(Boolean) ?? []

        const rightColumns =
          right
            ?.map((columnId) => leafColumns.find((d) => d.id === columnId)!)
            .filter(Boolean) ?? []

        const centerColumns = leafColumns.filter(
          (column) => !left?.includes(column.id) && !right?.includes(column.id),
        )

        const headerGroups = buildHeaderGroups(
          allColumns,
          [...leftColumns, ...centerColumns, ...rightColumns],
          table,
        )

        return headerGroups
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugHeaders,
        key: process.env.NODE_ENV === "development" && "getHeaderGroups",
      },
    )

    table.getCenterHeaderGroups = memo(
      () => [
        table.getAllColumns(),
        table.getVisibleLeafColumns(),
        table.getState().columnPinning.left,
        table.getState().columnPinning.right,
      ],
      (allColumns, leafColumns, left, right) => {
        leafColumns = leafColumns.filter(
          (column) => !left?.includes(column.id) && !right?.includes(column.id),
        )
        return buildHeaderGroups(allColumns, leafColumns, table, "center")
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugHeaders,
        key: process.env.NODE_ENV === "development" && "getCenterHeaderGroups",
      },
    )

    table.getLeftHeaderGroups = memo(
      () => [
        table.getAllColumns(),
        table.getVisibleLeafColumns(),
        table.getState().columnPinning.left,
      ],
      (allColumns, leafColumns, left) => {
        const orderedLeafColumns =
          left
            ?.map((columnId) => leafColumns.find((d) => d.id === columnId)!)
            .filter(Boolean) ?? []

        return buildHeaderGroups(allColumns, orderedLeafColumns, table, "left")
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugHeaders,
        key: process.env.NODE_ENV === "development" && "getLeftHeaderGroups",
      },
    )

    table.getRightHeaderGroups = memo(
      () => [
        table.getAllColumns(),
        table.getVisibleLeafColumns(),
        table.getState().columnPinning.right,
      ],
      (allColumns, leafColumns, right) => {
        const orderedLeafColumns =
          right
            ?.map((columnId) => leafColumns.find((d) => d.id === columnId)!)
            .filter(Boolean) ?? []

        return buildHeaderGroups(allColumns, orderedLeafColumns, table, "right")
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugHeaders,
        key: process.env.NODE_ENV === "development" && "getRightHeaderGroups",
      },
    )

    // Footer Groups

    table.getFooterGroups = memo(
      () => [table.getHeaderGroups()],
      (headerGroups) => {
        return [...headerGroups].reverse()
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugHeaders,
        key: process.env.NODE_ENV === "development" && "getFooterGroups",
      },
    )

    table.getLeftFooterGroups = memo(
      () => [table.getLeftHeaderGroups()],
      (headerGroups) => {
        return [...headerGroups].reverse()
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugHeaders,
        key: process.env.NODE_ENV === "development" && "getLeftFooterGroups",
      },
    )

    table.getCenterFooterGroups = memo(
      () => [table.getCenterHeaderGroups()],
      (headerGroups) => {
        return [...headerGroups].reverse()
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugHeaders,
        key: process.env.NODE_ENV === "development" && "getCenterFooterGroups",
      },
    )

    table.getRightFooterGroups = memo(
      () => [table.getRightHeaderGroups()],
      (headerGroups) => {
        return [...headerGroups].reverse()
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugHeaders,
        key: process.env.NODE_ENV === "development" && "getRightFooterGroups",
      },
    )

    // Flat Headers

    table.getFlatHeaders = memo(
      () => [table.getHeaderGroups()],
      (headerGroups) => {
        return headerGroups
          .map((headerGroup) => {
            return headerGroup.headers
          })
          .flat()
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugHeaders,
        key: process.env.NODE_ENV === "development" && "getFlatHeaders",
      },
    )

    table.getLeftFlatHeaders = memo(
      () => [table.getLeftHeaderGroups()],
      (left) => {
        return left
          .map((headerGroup) => {
            return headerGroup.headers
          })
          .flat()
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugHeaders,
        key: process.env.NODE_ENV === "development" && "getLeftFlatHeaders",
      },
    )

    table.getCenterFlatHeaders = memo(
      () => [table.getCenterHeaderGroups()],
      (left) => {
        return left
          .map((headerGroup) => {
            return headerGroup.headers
          })
          .flat()
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugHeaders,
        key: process.env.NODE_ENV === "development" && "getCenterFlatHeaders",
      },
    )

    table.getRightFlatHeaders = memo(
      () => [table.getRightHeaderGroups()],
      (left) => {
        return left
          .map((headerGroup) => {
            return headerGroup.headers
          })
          .flat()
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugHeaders,
        key: process.env.NODE_ENV === "development" && "getRightFlatHeaders",
      },
    )

    // Leaf Headers

    table.getCenterLeafHeaders = memo(
      () => [table.getCenterFlatHeaders()],
      (flatHeaders) => {
        return flatHeaders.filter((header) => !header.subHeaders?.length)
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugHeaders,
        key: process.env.NODE_ENV === "development" && "getCenterLeafHeaders",
      },
    )

    table.getLeftLeafHeaders = memo(
      () => [table.getLeftFlatHeaders()],
      (flatHeaders) => {
        return flatHeaders.filter((header) => !header.subHeaders?.length)
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugHeaders,
        key: process.env.NODE_ENV === "development" && "getLeftLeafHeaders",
      },
    )

    table.getRightLeafHeaders = memo(
      () => [table.getRightFlatHeaders()],
      (flatHeaders) => {
        return flatHeaders.filter((header) => !header.subHeaders?.length)
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugHeaders,
        key: process.env.NODE_ENV === "development" && "getRightLeafHeaders",
      },
    )

    table.getLeafHeaders = memo(
      () => [
        table.getLeftHeaderGroups(),
        table.getCenterHeaderGroups(),
        table.getRightHeaderGroups(),
      ],
      (left, center, right) => {
        return [
          ...(left[0]?.headers ?? []),
          ...(center[0]?.headers ?? []),
          ...(right[0]?.headers ?? []),
        ]
          .map((header) => {
            return header.getLeafHeaders()
          })
          .flat()
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugHeaders,
        key: process.env.NODE_ENV === "development" && "getLeafHeaders",
      },
    )
  },
}

export function buildHeaderGroups<TData extends RowData>(
  allColumns: Column<TData, unknown>[],
  columnsToGroup: Column<TData, unknown>[],
  table: TableInstance<TData>,
  headerFamily?: "center" | "left" | "right",
): HeaderGroup<TData>[] {
  // Find the max depth of the columns:
  // build the leaf column row
  // build each buffer row going up
  //    placeholder for non-existent level
  //    real column for existing level

  let maxDepth = 0

  const findMaxDepth = (columns: Column<TData, unknown>[], depth = 1) => {
    maxDepth = Math.max(maxDepth, depth)

    columns
      .filter((column) => column.getIsVisible())
      .forEach((column) => {
        if (column.columns?.length) {
          findMaxDepth(column.columns, depth + 1)
        }
      }, 0)
  }

  findMaxDepth(allColumns)

  const headerGroups: HeaderGroup<TData>[] = []

  const createHeaderGroup = (
    headersToGroup: Header<TData, unknown>[],
    depth: number,
  ) => {
    // The header group we are creating
    const headerGroup: HeaderGroup<TData> = {
      depth,
      headers: [],
      id: [headerFamily, `${depth}`].filter(Boolean).join("_"),
    }

    // The parent columns we're going to scan next
    const pendingParentHeaders: Header<TData, unknown>[] = []

    // Scan each column for parents
    headersToGroup.forEach((headerToGroup) => {
      // What is the latest (last) parent column?

      const latestPendingParentHeader = [...pendingParentHeaders].reverse()[0]

      const isLeafHeader = headerToGroup.column.depth === headerGroup.depth

      let column: Column<TData, unknown>
      let isPlaceholder = false

      if (isLeafHeader && headerToGroup.column.parent) {
        // The parent header is new
        column = headerToGroup.column.parent
      } else {
        // The parent header is repeated
        column = headerToGroup.column
        isPlaceholder = true
      }

      if (
        latestPendingParentHeader &&
        latestPendingParentHeader?.column === column
      ) {
        // This column is repeated. Add it as a sub header to the next batch
        latestPendingParentHeader.subHeaders.push(headerToGroup)
      } else {
        // This is a new header. Let's create it
        const header = createHeader(table, column, {
          depth,
          id: [headerFamily, depth, column.id, headerToGroup?.id]
            .filter(Boolean)
            .join("_"),
          index: pendingParentHeaders.length,
          isPlaceholder,
          placeholderId: isPlaceholder
            ? `${
                pendingParentHeaders.filter((d) => d.column === column).length
              }`
            : undefined,
        })

        // Add the headerToGroup as a subHeader of the new header
        header.subHeaders.push(headerToGroup)
        // Add the new header to the pendingParentHeaders to get grouped
        // in the next batch
        pendingParentHeaders.push(header)
      }

      headerGroup.headers.push(headerToGroup)
      headerToGroup.headerGroup = headerGroup
    })

    headerGroups.push(headerGroup)

    if (depth > 0) {
      createHeaderGroup(pendingParentHeaders, depth - 1)
    }
  }

  const bottomHeaders = columnsToGroup.map((column, index) =>
    createHeader(table, column, {
      depth: maxDepth,
      index,
    }),
  )

  createHeaderGroup(bottomHeaders, maxDepth - 1)

  headerGroups.reverse()

  // headerGroups = headerGroups.filter(headerGroup => {
  //   return !headerGroup.headers.every(header => header.isPlaceholder)
  // })

  const recurseHeadersForSpans = (
    headers: Header<TData, unknown>[],
  ): {colSpan: number; rowSpan: number}[] => {
    const filteredHeaders = headers.filter((header) =>
      header.column.getIsVisible(),
    )

    return filteredHeaders.map((header) => {
      let colSpan = 0
      let rowSpan = 0
      let childRowSpans = [0]

      if (header.subHeaders && header.subHeaders.length) {
        childRowSpans = []

        recurseHeadersForSpans(header.subHeaders).forEach(
          ({colSpan: childColSpan, rowSpan: childRowSpan}) => {
            colSpan += childColSpan
            childRowSpans.push(childRowSpan)
          },
        )
      } else {
        colSpan = 1
      }

      const minChildRowSpan = Math.min(...childRowSpans)
      rowSpan = rowSpan + minChildRowSpan

      header.colSpan = colSpan
      header.rowSpan = rowSpan

      return {colSpan, rowSpan}
    })
  }

  recurseHeadersForSpans(headerGroups[0]?.headers ?? [])

  return headerGroups
}
