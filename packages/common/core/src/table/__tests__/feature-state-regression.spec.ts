import {describe, expect, test} from "vitest"

import {createTableHarness, groupedColumns} from "./table-test-utils"

describe("table feature state regression", () => {
  test("column visibility hides cells and preserves non-hideable columns", () => {
    const {getState, table} = createTableHarness()

    table.toggleAllColumnsVisible(false)

    expect(table.getColumn("firstName")?.getIsVisible()).toBe(true)
    expect(table.getColumn("lastName")?.getIsVisible()).toBe(false)
    expect(table.getIsSomeColumnsVisible()).toBe(true)
    expect(table.getIsAllColumnsVisible()).toBe(false)
    expect(
      table
        .getRowModel()
        .rows[0].getVisibleCells()
        .map((cell) => cell.column.id),
    ).toEqual(["firstName"])

    table.getColumn("lastName")?.toggleVisibility(true)

    expect(getState().columnVisibility.lastName).toBe(true)
    expect(table.getVisibleLeafColumns().map((column) => column.id)).toContain(
      "lastName",
    )
  })

  test("column order is applied before grouping column mode", () => {
    const {getState, table} = createTableHarness({
      state: {
        columnOrder: ["visits", "lastName", "firstName"],
        grouping: ["status"],
      },
    })

    expect(table.getAllLeafColumns().map((column) => column.id)).toEqual([
      "status",
      "visits",
      "lastName",
      "firstName",
      "age",
      "rank",
      "createdAt",
      "tags",
    ])

    table.updateOptions({groupedColumnMode: "remove"})

    expect(table.getAllLeafColumns().map((column) => column.id)).toEqual([
      "visits",
      "lastName",
      "firstName",
      "age",
      "rank",
      "createdAt",
      "tags",
    ])

    table.resetColumnOrder(true)
    expect(getState().columnOrder).toEqual([])
  })

  test("column pinning splits leaf columns, visible cells, and header groups", () => {
    const {getState, table} = createTableHarness({
      columns: groupedColumns,
    })

    table.getColumn("firstName")?.pin("left")
    table.getColumn("visits")?.pin("right")

    expect(getState().columnPinning).toEqual({
      left: ["firstName"],
      right: ["visits"],
    })
    expect(
      table.getLeftVisibleLeafColumns().map((column) => column.id),
    ).toEqual(["firstName"])
    expect(
      table.getCenterVisibleLeafColumns().map((column) => column.id),
    ).toEqual(["lastName", "age", "status"])
    expect(
      table.getRightVisibleLeafColumns().map((column) => column.id),
    ).toEqual(["visits"])

    const firstRow = table.getRowModel().rows[0]

    expect(
      firstRow.getLeftVisibleCells().map((cell) => cell.column.id),
    ).toEqual(["firstName"])
    expect(
      firstRow.getCenterVisibleCells().map((cell) => cell.column.id),
    ).toEqual(["lastName", "age", "status"])
    expect(
      firstRow.getRightVisibleCells().map((cell) => cell.column.id),
    ).toEqual(["visits"])
    expect(table.getLeftHeaderGroups()[0].id).toBe("left_0")
    expect(table.getRightHeaderGroups()[0].id).toBe("right_0")
  })

  test("row pinning includes requested parent and leaf rows without duplicating positions", () => {
    const {getState, table} = createTableHarness({
      state: {
        expanded: {"1": true},
      },
    })

    table.getRow("1", true).pin("top", true)
    table.getRow("1.0", true).pin("bottom", false, true)

    expect(getState().rowPinning.top).toEqual(["1.1"])
    expect(getState().rowPinning.bottom).toEqual(["1", "1.0"])
    expect(table.getTopRows().map((row) => row.id)).toEqual(["1.1"])
    expect(table.getBottomRows().map((row) => row.id)).toEqual(["1", "1.0"])
    expect(table.getCenterRows().map((row) => row.id)).toEqual(["0", "2", "3"])
  })

  test("keepPinnedRows false hides pinned rows outside current pagination", () => {
    const {table} = createTableHarness({
      state: {
        pagination: {
          pageIndex: 1,
          pageSize: 1,
        },
        rowPinning: {
          bottom: [],
          includeLeafRows: false,
          includeParentRows: false,
          top: ["0"],
        },
      },
      tableOptions: {
        keepPinnedRows: false,
      },
    })

    expect(table.getRowModel().rows.map((row) => row.id)).toEqual(["1"])
    expect(table.getTopRows()).toEqual([])
  })

  test("column sizing clamps sizes and totals pinned regions", () => {
    const {getState, table} = createTableHarness({
      state: {
        columnPinning: {
          left: ["firstName"],
          right: ["visits"],
        },
        columnSizing: {
          age: 10,
          firstName: 125,
          visits: 500,
        },
      },
    })

    expect(table.getColumn("age")?.getSize()).toBe(20)
    expect(table.getColumn("visits")?.getSize()).toBe(300)
    expect(table.getColumn("firstName")?.getStart()).toBe(0)
    expect(table.getColumn("lastName")?.getStart()).toBe(125)
    expect(table.getLeftTotalSize()).toBe(125)
    expect(table.getRightTotalSize()).toBe(300)

    table.getColumn("visits")?.resetSize()

    expect(getState().columnSizing).toEqual({
      age: 10,
      firstName: 125,
    })
  })

  test("reset APIs restore initial feature state or blank defaults", () => {
    const {getState, table} = createTableHarness({
      initialState: {
        columnOrder: ["status"],
        columnPinning: {left: ["firstName"], right: ["visits"]},
        columnSizing: {visits: 120},
        columnVisibility: {age: false},
        pagination: {pageIndex: 2, pageSize: 3},
        rowPinning: {
          bottom: ["3"],
          includeLeafRows: false,
          includeParentRows: false,
          top: ["0"],
        },
      },
    })

    table.setColumnOrder(["visits"])
    table.setColumnPinning({left: [], right: []})
    table.setColumnSizing({age: 99})
    table.setColumnVisibility({lastName: false})
    table.setPagination({pageIndex: 0, pageSize: 10})
    table.setRowPinning({
      bottom: [],
      includeLeafRows: false,
      includeParentRows: false,
      top: [],
    })

    table.resetColumnOrder()
    table.resetColumnPinning()
    table.resetColumnSizing()
    table.resetColumnVisibility()
    table.resetPagination()
    table.resetRowPinning()

    expect(getState().columnOrder).toEqual(["status"])
    expect(getState().columnPinning).toEqual({
      left: ["firstName"],
      right: ["visits"],
    })
    expect(getState().columnSizing).toEqual({visits: 120})
    expect(getState().columnVisibility).toEqual({age: false})
    expect(getState().pagination).toEqual({pageIndex: 2, pageSize: 3})
    expect(getState().rowPinning).toEqual({
      bottom: ["3"],
      includeLeafRows: false,
      includeParentRows: false,
      top: ["0"],
    })

    table.resetColumnPinning(true)
    table.resetColumnSizing(true)
    table.resetColumnVisibility(true)
    table.resetPagination(true)
    table.resetRowPinning(true)

    expect(getState().columnPinning).toEqual({left: [], right: []})
    expect(getState().columnSizing).toEqual({})
    expect(getState().columnVisibility).toEqual({})
    expect(getState().pagination).toEqual({pageIndex: 0, pageSize: 10})
    expect(getState().rowPinning).toEqual({
      bottom: [],
      includeLeafRows: false,
      includeParentRows: false,
      top: [],
    })
  })
})
