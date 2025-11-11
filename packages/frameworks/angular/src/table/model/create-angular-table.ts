import {computed, type Signal, signal} from "@angular/core"

import {
  createTable,
  type RowData,
  type TableInstance,
  type TableOptions,
  type TableOptionsResolved,
  type TableState,
} from "@qualcomm-ui/core/table"

import {lazyInit} from "./lazy-signal-initializer"
import {proxifyTable} from "./proxify-table"

export interface AngularTable<TData extends RowData>
  extends TableInstance<TData>,
    Signal<TableInstance<TData>> {}

export function createAngularTable<TData extends RowData>(
  options: () => TableOptions<TData>,
): AngularTable<TData> {
  return lazyInit(() => {
    const resolvedOptions: any = {
      onStateChange: () => {},
      renderFallbackValue: null,
      state: {},
      ...options(),
    }

    const table = createTable(resolvedOptions)

    // By default, manage table state here using the table's initial state
    const state = signal<TableState>({
      ...table.initialState,
    })

    // Compose table options using computed.
    // This is to allow `tableSignal` to listen and set table options after the
    // table has been created
    const updatedOptions = computed<TableOptionsResolved<TData>>(() => {
      // listen to table state changed
      const tableState = state()
      // listen to input options changed
      const tableOptions = options()
      return {
        ...table.options,
        ...resolvedOptions,
        ...tableOptions,
        onStateChange: (updater) => {
          const value =
            updater instanceof Function ? updater(tableState) : updater
          state.set(value)
          resolvedOptions.onStateChange?.(updater)
        },
        state: {...tableState, ...tableOptions.state},
      }
    })

    // convert table instance to signal for proxify to listen to any table state and
    // options changes
    const tableSignal = computed(
      () => {
        table.setOptions(updatedOptions() as any)
        return table
      },
      {
        equal: () => false,
      },
    )

    // proxify Table instance to enable reactive table state changes
    return proxifyTable(tableSignal as any)
  }) as any
}
