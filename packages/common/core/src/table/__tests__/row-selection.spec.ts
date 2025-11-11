import {describe, expect, test} from "vitest"

import {createTable, getCoreRowModel, selectRowsFn, type TableState} from "../"

import {generateColumns, makeData, type Person} from "./make-test-data"

describe("Row Selection", async () => {
  test("The row selection state reflects the selected rows", () => {
    const data = makeData(5)
    const columns = generateColumns(data)

    const table = createTable<Person>({
      columns,
      data,
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
      getSubRows: (row) => row.subRows,
      onStateChange(updater) {
        // this function is scoped to the table instance and modifies its internal
        // state with calls to `this.state`.
        this.state =
          typeof updater === "function"
            ? updater(this.state as TableState)
            : updater
      },
      renderFallbackValue: "",
      state: {
        rowSelection: {
          "0": true,
          "2": true,
        },
      },
    })

    const rowModel = table.getCoreRowModel()
    const result = selectRowsFn(table, rowModel)

    expect(result.rows.length).toBe(2)
    expect(result.flatRows.length).toBe(2)
    expect(result.rowsById).toHaveProperty("0")
    expect(result.rowsById).toHaveProperty("2")
  })
})

/**
 * Row selection criteria:
 * When all children are selected, the parent should be selected.
 * When only some children are selected, the parent should be indeterminate.
 * When no children are selected, the parent should be unselected.
 */
describe("Row selection with sub-rows", () => {
  test("When the parent row is selected, all child rows should be selected", () => {
    const data = makeData(2, 2, 2)
    const columns = generateColumns(data)

    const table = createTable<Person>({
      columns,
      data,
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
      getSubRows: (row) => row.subRows,
      onStateChange(updater) {
        this.state =
          typeof updater === "function"
            ? updater(this.state as TableState)
            : updater
      },
      renderFallbackValue: "",
      state: {
        rowSelection: {},
      },
    })

    table.getCoreRowModel().rows[0].toggleSelected()
    const state = table.getState().rowSelection
    expect(state).to.deep.eq({
      "0": true,
      "0.0.0": true,
      "0.0.1": true,
      "0.1.0": true,
      "0.1.1": true,
      "0.0": true,
      "0.1": true,
    })
  })

  test("Parent rows should respond to child row toggle events.", () => {
    const data = makeData(2, 2, 2)
    const columns = generateColumns(data)

    const table = createTable<Person>({
      columns,
      data,
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
      getSubRows: (row) => row.subRows,
      onStateChange(updater) {
        this.state =
          typeof updater === "function"
            ? updater(this.state as TableState)
            : updater
      },
      renderFallbackValue: "",
      state: {
        rowSelection: {
          "0": true,
          "0.0.0": true,
          "0.0.1": true,
          "0.1.0": true,
          "0.1.1": true,
          "0.0": true,
          "0.1": true,
        },
      },
    })

    table.getCoreRowModel().flatRows[1].toggleSelected()
    expect(table.getState().rowSelection).to.deep.eq({
      "0.1.0": true,
      "0.1.1": true,
      "0.1": true,
    })

    table.getCoreRowModel().flatRows[5].toggleSelected()
    expect(table.getState().rowSelection).to.deep.eq({"0.1.1": true})

    table.getCoreRowModel().flatRows[5].toggleSelected()
    expect(table.getState().rowSelection).to.deep.eq({
      "0.1.0": true,
      "0.1.1": true,
      "0.1": true,
    })

    table.getCoreRowModel().flatRows[1].toggleSelected()
    expect(table.getState().rowSelection).to.deep.eq({
      "0": true,
      "0.0.0": true,
      "0.0.1": true,
      "0.1.0": true,
      "0.1.1": true,
      "0.0": true,
      "0.1": true,
    })
  })
})
