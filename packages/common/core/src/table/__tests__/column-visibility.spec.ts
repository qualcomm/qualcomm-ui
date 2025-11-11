import {describe, expect, test} from "vitest"

import {
  createTable,
  getCoreRowModel,
  getExpandedRowModel,
  type TableState,
} from "../"

import {generateColumns, makeData, type Person} from "./make-test-data"

describe("Column Visibility", () => {
  test("The visible cells are reflected by the column visibility state", () => {
    const data = makeData(2)
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
        columnPinning: {},
        columnVisibility: {
          firstName: false,
        },
      },
    })

    // visible columns are hidden from the row model's cells
    const cells = table
      .getRowModel()
      .rows.flatMap((row) => row.getVisibleCells())
    cells.forEach((cell) => expect(cell.column.id).not.eq("firstName"))
  })
})
