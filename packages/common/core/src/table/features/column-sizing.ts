// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TableFeature} from "../core/table"
import {safeDocument, safeWindow} from "../dom"
import type {
  Column,
  Header,
  OnChangeFn,
  RowData,
  TableInstance,
  Updater,
} from "../types"
import {makeStateUpdater} from "../utils"

import type {ColumnPinningPosition} from "./pinning"

export interface ColumnSizingTableState {
  columnSizing: ColumnSizingState
  columnSizingInfo: ColumnSizingInfoState
}

export type ColumnSizingState = Record<string, number>

export interface ColumnSizingInfoState {
  columnSizingStart: [string, number][]
  deltaOffset: null | number
  deltaPercentage: null | number
  isResizingColumn: false | string
  startOffset: null | number
  startSize: null | number
}

export type ColumnResizeMode = "onChange" | "onEnd"

export type ColumnResizeDirection = "ltr" | "rtl"

export interface ColumnSizingOptions {
  /**
   * Enables or disables right-to-left support for resizing the column. defaults to
   * 'ltr'.
   */
  columnResizeDirection?: ColumnResizeDirection
  /**
   * Determines when the columnSizing state is updated. `onChange` updates the state
   * when the user is dragging the resize handle. `onEnd` updates the state when the
   * user releases the resize handle.
   */
  columnResizeMode?: ColumnResizeMode
  /**
   * Enables or disables column resizing for the column.
   */
  enableColumnResizing?: boolean
  /**
   * If provided, this function will be called with an `updaterFn` when
   * `state.columnSizing` changes. This overrides the default internal state
   * management, so you will also need to supply `state.columnSizing` from your own
   * managed state.
   */
  onColumnSizingChange?: OnChangeFn<ColumnSizingState>
  /**
   * If provided, this function will be called with an `updaterFn` when
   * `state.columnSizingInfo` changes. This overrides the default internal state
   * management, so you will also need to supply `state.columnSizingInfo` from your
   * own managed state.
   */
  onColumnSizingInfoChange?: OnChangeFn<ColumnSizingInfoState>
}

export type ColumnSizingDefaultOptions = Pick<
  ColumnSizingOptions,
  | "columnResizeMode"
  | "onColumnSizingChange"
  | "onColumnSizingInfoChange"
  | "columnResizeDirection"
>

export interface ColumnSizingInstance {
  /**
   * If pinning, returns the total size of the center portion of the table by
   * calculating the sum of the sizes of all unpinned/center leaf-columns.
   */
  getCenterTotalSize: () => number
  /**
   * Returns the total size of the left portion of the table by calculating the sum
   * of the sizes of all left leaf-columns.
   */
  getLeftTotalSize: () => number
  /**
   * Returns the total size of the right portion of the table by calculating the sum
   * of the sizes of all right leaf-columns.
   */
  getRightTotalSize: () => number
  /**
   * Returns the total size of the table by calculating the sum of the sizes of all
   * leaf-columns.
   */
  getTotalSize: () => number
  /**
   * Resets column sizing to its initial state. If `defaultState` is `true`, the
   * default state for the table will be used instead of the initialValue provided
   * to the table.
   */
  resetColumnSizing: (defaultState?: boolean) => void
  /**
   * Resets column sizing info to its initial state. If `defaultState` is `true`,
   * the default state for the table will be used instead of the initialValue
   * provided to the table.
   */
  resetHeaderSizeInfo: (defaultState?: boolean) => void
  /**
   * Sets the column sizing state using an updater function or a value. This will
   * trigger the underlying `onColumnSizingChange` function if one is passed to the
   * table options, otherwise the state will be managed automatically by the table.
   */
  setColumnSizing: (updater: Updater<ColumnSizingState>) => void
  /**
   * Sets the column sizing info state using an updater function or a value. This
   * will trigger the underlying `onColumnSizingInfoChange` function if one is
   * passed to the table options, otherwise the state will be managed automatically
   * by the table.
   */
  setColumnSizingInfo: (updater: Updater<ColumnSizingInfoState>) => void
}

export interface ColumnSizingColumnDef {
  /**
   * Enables or disables column resizing for the column.
   */
  enableResizing?: boolean

  /**
   * The maximum allowed size for the column
   */
  maxSize?: number

  /**
   * The minimum allowed size for the column
   */
  minSize?: number

  /**
   * The desired size for the column
   */
  size?: number
}

export interface ColumnSizingColumn {
  /**
   * Returns `true` if the column can be resized.
   */
  getCanResize: () => boolean
  /**
   * Returns `true` if the column is currently being resized.
   */
  getIsResizing: () => boolean
  /**
   * Returns the current size of the column.
   */
  getSize: () => number
  /**
   * Returns the offset measurement along the row-axis (usually the x-axis for
   * standard tables) for the header. This is effectively a sum of the offset
   * measurements of all preceding headers.
   */
  getStart: (position?: ColumnPinningPosition) => number
  /**
   * Resets the column to its initial size.
   */
  resetSize: () => void
}

export interface ColumnSizingHeader {
  /**
   * Returns an event handler function that can be used to resize the header. It can
   * be used as an:
   * - `onMouseDown` handler
   * - `onTouchStart` handler
   *
   * The dragging and release events are automatically handled for you.
   */
  getResizeHandler: () => (event: unknown) => void
  /**
   * Returns the current size of the header.
   */
  getSize: () => number
  /**
   * Returns the offset measurement along the row-axis (usually the x-axis for
   * standard tables) for the header. This is effectively a sum of the offset
   * measurements of all preceding headers.
   */
  getStart: (position?: ColumnPinningPosition) => number
}

export const defaultColumnSizing: {
  maxSize: number
  minSize: number
  size: number
} = {
  maxSize: Number.MAX_SAFE_INTEGER,
  minSize: 20,
  size: 150,
}

const getDefaultColumnSizingInfoState = (): ColumnSizingInfoState => ({
  columnSizingStart: [],
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  startOffset: null,
  startSize: null,
})

export const ColumnSizing: TableFeature = {
  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: TableInstance<TData>,
  ): void => {
    column.getSize = () => {
      const columnSize = table.getState().columnSizing[column.id]

      return Math.min(
        Math.max(
          column.columnDef.minSize ?? defaultColumnSizing.minSize,
          columnSize ?? column.columnDef.size ?? defaultColumnSizing.size,
        ),
        column.columnDef.maxSize ?? defaultColumnSizing.maxSize,
      )
    }
    column.getStart = (position) => {
      const columns = !position
        ? table.getVisibleLeafColumns()
        : position === "left"
          ? table.getLeftVisibleLeafColumns()
          : table.getRightVisibleLeafColumns()

      const index = columns.findIndex((d) => d.id === column.id)

      if (index > 0) {
        const prevSiblingColumn = columns[index - 1]

        return (
          prevSiblingColumn.getStart(position) + prevSiblingColumn.getSize()
        )
      }

      return 0
    }
    column.resetSize = () => {
      table.setColumnSizing(({[column.id]: _, ...rest}) => {
        return rest
      })
    }
    column.getCanResize = () => {
      return (
        (column.columnDef.enableResizing ?? true) &&
        (table.options.enableColumnResizing ?? true)
      )
    }
    column.getIsResizing = () => {
      return table.getState().columnSizingInfo.isResizingColumn === column.id
    }
  },
  createHeader: <TData extends RowData, TValue>(
    header: Header<TData, TValue>,
    table: TableInstance<TData>,
  ): void => {
    header.getSize = () => {
      let sum = 0

      const recurse = (header: Header<TData, TValue>) => {
        if (header.subHeaders.length) {
          header.subHeaders.forEach(recurse)
        } else {
          sum += header.column.getSize() ?? 0
        }
      }

      recurse(header)

      return sum
    }
    header.getStart = () => {
      if (header.index > 0) {
        const prevSiblingHeader = header.headerGroup.headers[header.index - 1]
        return prevSiblingHeader.getStart() + prevSiblingHeader.getSize()
      }

      return 0
    }
    header.getResizeHandler = () => {
      const column = table.getColumn(header.column.id)
      const canResize = column?.getCanResize()

      return (e: unknown) => {
        if (!column || !canResize) {
          return
        }

        ;(e as any).persist?.()

        if (isTouchStartEvent(e)) {
          // lets not respond to multiple touches (e.g.,2 or 3 fingers)
          if (e.touches && e.touches.length > 1) {
            return
          }
        }

        const startSize = header.getSize()

        const columnSizingStart: [string, number][] = header
          ? header
              .getLeafHeaders()
              .map((d) => [d.column.id, d.column.getSize()])
          : [[column.id, column.getSize()]]

        const clientX = isTouchStartEvent(e)
          ? Math.round(e.touches[0].clientX)
          : (e as MouseEvent).clientX

        const newColumnSizing: ColumnSizingState = {}

        const updateOffset = (
          eventType: "move" | "end",
          clientXPos?: number,
        ) => {
          if (typeof clientXPos !== "number") {
            return
          }

          table.setColumnSizingInfo((old) => {
            const deltaDirection =
              table.options.columnResizeDirection === "rtl" ? -1 : 1
            const deltaOffset =
              (clientXPos - (old?.startOffset ?? 0)) * deltaDirection
            const deltaPercentage = Math.max(
              deltaOffset / (old?.startSize ?? 0),
              -0.999999,
            )

            old.columnSizingStart.forEach(([columnId, headerSize]) => {
              newColumnSizing[columnId] =
                Math.round(
                  Math.max(headerSize + headerSize * deltaPercentage, 0) * 100,
                ) / 100
            })

            return {
              ...old,
              deltaOffset,
              deltaPercentage,
            }
          })

          if (
            table.options.columnResizeMode === "onChange" ||
            eventType === "end"
          ) {
            table.setColumnSizing((old) => ({
              ...old,
              ...newColumnSizing,
            }))
          }
        }

        const onMove = (clientXPos?: number) => updateOffset("move", clientXPos)

        const onEnd = (clientXPos?: number) => {
          updateOffset("end", clientXPos)

          table.setColumnSizingInfo((old) => ({
            ...old,
            columnSizingStart: [],
            deltaOffset: null,
            deltaPercentage: null,
            isResizingColumn: false,
            startOffset: null,
            startSize: null,
          }))
        }

        const mouseEvents = {
          moveHandler: (e: MouseEvent) => onMove(e.clientX),
          upHandler: (e: MouseEvent) => {
            safeDocument?.removeEventListener(
              "mousemove",
              mouseEvents.moveHandler,
            )
            safeDocument?.removeEventListener("mouseup", mouseEvents.upHandler)
            onEnd(e.clientX)
          },
        }

        const touchEvents = {
          moveHandler: (e: TouchEvent) => {
            if (e.cancelable) {
              e.preventDefault()
              e.stopPropagation()
            }
            onMove(e.touches[0].clientX)
            return false
          },
          upHandler: (e: TouchEvent) => {
            safeDocument?.removeEventListener(
              "touchmove",
              touchEvents.moveHandler,
            )
            safeDocument?.removeEventListener("touchend", touchEvents.upHandler)
            if (e.cancelable) {
              e.preventDefault()
              e.stopPropagation()
            }
            onEnd(e.touches[0]?.clientX)
          },
        }

        const passiveIfSupported = passiveEventSupported()
          ? {passive: false}
          : false

        if (isTouchStartEvent(e)) {
          safeDocument?.addEventListener(
            "touchmove",
            touchEvents.moveHandler,
            passiveIfSupported,
          )
          safeDocument?.addEventListener(
            "touchend",
            touchEvents.upHandler,
            passiveIfSupported,
          )
        } else {
          safeDocument?.addEventListener(
            "mousemove",
            mouseEvents.moveHandler,
            passiveIfSupported,
          )
          safeDocument?.addEventListener(
            "mouseup",
            mouseEvents.upHandler,
            passiveIfSupported,
          )
        }

        table.setColumnSizingInfo((old) => ({
          ...old,
          columnSizingStart,
          deltaOffset: 0,
          deltaPercentage: 0,
          isResizingColumn: column.id,
          startOffset: clientX,
          startSize,
        }))
      }
    }
  },

  createTable: <TData extends RowData>(table: TableInstance<TData>): void => {
    table.setColumnSizing = (updater) =>
      table.options.onColumnSizingChange?.(updater)
    table.setColumnSizingInfo = (updater) =>
      table.options.onColumnSizingInfoChange?.(updater)
    table.resetColumnSizing = (defaultState) => {
      table.setColumnSizing(
        defaultState ? {} : (table.initialState.columnSizing ?? {}),
      )
    }
    table.resetHeaderSizeInfo = (defaultState) => {
      table.setColumnSizingInfo(
        defaultState
          ? getDefaultColumnSizingInfoState()
          : (table.initialState.columnSizingInfo ??
              getDefaultColumnSizingInfoState()),
      )
    }
    table.getTotalSize = () =>
      table.getHeaderGroups()[0]?.headers.reduce((sum, header) => {
        return sum + header.getSize()
      }, 0) ?? 0
    table.getLeftTotalSize = () =>
      table.getLeftHeaderGroups()[0]?.headers.reduce((sum, header) => {
        return sum + header.getSize()
      }, 0) ?? 0
    table.getCenterTotalSize = () =>
      table.getCenterHeaderGroups()[0]?.headers.reduce((sum, header) => {
        return sum + header.getSize()
      }, 0) ?? 0
    table.getRightTotalSize = () =>
      table.getRightHeaderGroups()[0]?.headers.reduce((sum, header) => {
        return sum + header.getSize()
      }, 0) ?? 0
  },

  getDefaultColumnDef: (): ColumnSizingColumnDef => {
    return defaultColumnSizing
  },

  getDefaultOptions: <TData extends RowData>(
    table: TableInstance<TData>,
  ): ColumnSizingDefaultOptions => {
    return {
      columnResizeDirection: "ltr",
      columnResizeMode: "onEnd",
      onColumnSizingChange: makeStateUpdater("columnSizing", table),
      onColumnSizingInfoChange: makeStateUpdater("columnSizingInfo", table),
    }
  },

  getInitialState: (state): ColumnSizingTableState => {
    return {
      columnSizing: {},
      columnSizingInfo: getDefaultColumnSizingInfoState(),
      ...state,
    }
  },
}

let passiveSupported: boolean | null = null
export function passiveEventSupported(): boolean {
  if (typeof passiveSupported === "boolean") {
    return passiveSupported
  }

  let supported = false
  try {
    const options = {
      get passive() {
        supported = true
        return false
      },
    }

    const noop = () => {}

    safeWindow?.addEventListener("test", noop, options)
    safeWindow?.removeEventListener("test", noop)
  } catch (err) {
    supported = false
  }
  passiveSupported = supported
  return passiveSupported
}

function isTouchStartEvent(e: unknown): e is TouchEvent {
  return (e as TouchEvent).type === "touchstart"
}
