import {describe, expect, test} from "vitest"

import {createTableHarness} from "./table-test-utils"

describe("table row selection regression", () => {
  test("table-level all-row selection tracks selected, some, and filtered models", () => {
    const {getState, table} = createTableHarness({
      state: {
        columnFilters: [{id: "status", value: "single"}],
      },
    })

    table.toggleAllRowsSelected(true)

    expect(table.getIsAllRowsSelected()).toBe(true)
    expect(table.getIsSomeRowsSelected()).toBe(false)
    expect(Object.keys(getState().rowSelection)).toEqual(["0", "3"])
    expect(
      table.getFilteredSelectedRowModel().rows.map((row) => row.id),
    ).toEqual(["0", "3"])

    table.getRow("0").toggleSelected(false)

    expect(table.getIsAllRowsSelected()).toBe(false)
    expect(table.getIsSomeRowsSelected()).toBe(true)
  })

  test("page-level all-row selection only toggles visible paginated rows", () => {
    const {getState, table} = createTableHarness({
      state: {
        pagination: {
          pageIndex: 1,
          pageSize: 2,
        },
      },
    })

    table.toggleAllPageRowsSelected(true)

    expect(Object.keys(getState().rowSelection)).toEqual(["2", "3"])
    expect(table.getIsAllPageRowsSelected()).toBe(true)
    expect(table.getIsSomePageRowsSelected()).toBe(false)
  })

  test("conditional row selection blocks disabled rows and enables sub-row selection", () => {
    const {getState, table} = createTableHarness({
      tableOptions: {
        enableRowSelection: (row) => row.original.status !== "complicated",
        enableSubRowSelection: true,
      },
    })

    expect(table.getRow("2").getCanSelect()).toBe(false)
    expect(table.getRow("1").getCanSelect()).toBe(true)

    table.getRow("1").toggleSelected(true)

    expect(getState().rowSelection).toEqual({
      "1": true,
      "1.0": true,
    })
    expect(table.getRow("1").getIsSomeSelected()).toBe(false)
    expect(table.getRow("1").getIsAllSubRowsSelected()).toBe(true)
  })

  test("resetRowSelection restores initial selection or blank default", () => {
    const {getState, table} = createTableHarness({
      initialState: {
        rowSelection: {"0": true},
      },
    })

    table.toggleAllRowsSelected(true)
    table.resetRowSelection()

    expect(getState().rowSelection).toEqual({"0": true})

    table.resetRowSelection(true)

    expect(getState().rowSelection).toEqual({})
  })
})

describe("table expansion regression", () => {
  test("row and table expansion state expose depth, some, and all indicators", () => {
    const {getState, table} = createTableHarness()

    expect(table.getCanSomeRowsExpand()).toBe(true)
    expect(table.getIsSomeRowsExpanded()).toBe(false)
    expect(table.getIsAllRowsExpanded()).toBe(false)

    table.getRow("1", true).toggleExpanded(true)

    expect(getState().expanded).toEqual({"1": true})
    expect(table.getIsSomeRowsExpanded()).toBe(true)
    expect(table.getExpandedDepth()).toBe(1)
    expect(table.getExpandedRowModel().rows.map((row) => row.id)).toEqual([
      "0",
      "1",
      "1.0",
      "1.1",
      "2",
      "3",
    ])
    expect(table.getRow("1.0", true).getIsAllParentsExpanded()).toBe(true)
  })

  test("toggleAllRowsExpanded uses boolean true and reset restores initial state", () => {
    const {getState, table} = createTableHarness({
      initialState: {
        expanded: {"1": true},
      },
    })

    table.toggleAllRowsExpanded(true)
    expect(getState().expanded).toBe(true)
    expect(table.getIsAllRowsExpanded()).toBe(true)

    table.toggleAllRowsExpanded(false)
    expect(getState().expanded).toEqual({})

    table.resetExpanded()
    expect(getState().expanded).toEqual({"1": true})

    table.resetExpanded(true)
    expect(getState().expanded).toEqual({})
  })

  test("paginateExpandedRows false keeps expanded children on the parent page", () => {
    const {table} = createTableHarness({
      state: {
        expanded: {"1": true},
        pagination: {
          pageIndex: 1,
          pageSize: 1,
        },
      },
      tableOptions: {
        paginateExpandedRows: false,
      },
    })

    expect(table.getRowModel().rows.map((row) => row.id)).toEqual([
      "1",
      "1.0",
      "1.1",
    ])
    expect(
      table.getRowModel().rows.map((row) => row.original.firstName),
    ).toEqual(["Grace", "Katherine", "Dorothy"])
  })

  test("manual expansion preserves pre-expanded rows while state still changes", () => {
    const {getState, table} = createTableHarness({
      tableOptions: {
        manualExpanding: true,
      },
    })

    table.getRow("1", true).toggleExpanded(true)

    expect(getState().expanded).toEqual({"1": true})
    expect(table.getExpandedRowModel().rows.map((row) => row.id)).toEqual([
      "0",
      "1",
      "2",
      "3",
    ])
  })
})
