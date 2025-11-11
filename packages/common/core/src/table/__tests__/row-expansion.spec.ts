import {describe, expect, test} from "vitest"

import {
  createTable,
  getCoreRowModel,
  getExpandedRowModel,
  type TableState,
} from "../"

import {generateColumns, makeData, type Person} from "./make-test-data"

describe("Row Expansion", () => {
  test("The row expansion state reflects the expanded rows", () => {
    const data = makeData(2, 2, 2)
    const columns = generateColumns(data)

    const table = createTable<Person>({
      columns,
      data,
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
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
        expanded: {},
      },
    })

    expect(table.getRowModel().flatRows.length).eq(14)

    table.getRowModel().flatRows[0].toggleExpanded()

    const rows = table.getRowModel().rows

    // each row has 2 sub-rows.  There are two rows shown initially. When the first
    // row is expanded, its 2 sub-rows are shown, totalling to 4 rows.
    expect(rows.length).eq(4)

    expect(table.getState().expanded).deep.eq({"0": true})
  })
})
