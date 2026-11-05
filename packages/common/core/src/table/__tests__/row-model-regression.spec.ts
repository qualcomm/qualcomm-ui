import {describe, expect, test} from "vitest"

import {createTableHarness, testData, type TestPerson} from "./table-test-utils"

const names = (rows: {original: TestPerson}[]) =>
  rows.map((row) => row.original.firstName)

describe("table row-model pipeline regression", () => {
  test("filters column values before sorting and pagination", () => {
    const {table} = createTableHarness({
      state: {
        columnFilters: [{id: "status", value: "single"}],
        pagination: {
          pageIndex: 0,
          pageSize: 1,
        },
        sorting: [{desc: true, id: "visits"}],
      },
    })

    expect(names(table.getFilteredRowModel().rows)).toEqual(["Ada", "Margaret"])
    expect(names(table.getSortedRowModel().rows)).toEqual(["Margaret", "Ada"])
    expect(names(table.getRowModel().rows)).toEqual(["Margaret"])
    expect(table.getPageCount()).toBe(2)
  })

  test("global filtering scans enabled columns", () => {
    const {table} = createTableHarness({
      state: {
        globalFilter: "hopper",
      },
    })

    expect(names(table.getFilteredRowModel().rows)).toEqual(["Grace"])
  })

  test("number range filters resolve string inputs and normalize inverted ranges", () => {
    const {table} = createTableHarness({
      state: {
        columnFilters: [{id: "age", value: ["40", "30"]}],
      },
    })

    expect(names(table.getFilteredRowModel().rows)).toEqual(["Ada", "Margaret"])
  })

  test("array filters use column getUniqueValues and auto-remove empty values", () => {
    const {getState, table} = createTableHarness()

    table.getColumn("tags")?.setFilterValue("systems")

    expect(getState().columnFilters).toEqual([{id: "tags", value: "systems"}])
    expect(names(table.getFilteredRowModel().rows)).toEqual([
      "Ada",
      "Grace",
      "Margaret",
    ])
    expect(table.getCoreRowModel().rows[0].getUniqueValues("tags")).toEqual([
      "math",
      "systems",
    ])

    table.getColumn("tags")?.setFilterValue("")

    expect(getState().columnFilters).toEqual([])
  })

  test("sorting is stable, supports undefined placement, and honors inverted ranking", () => {
    const {table} = createTableHarness({
      state: {
        sorting: [{desc: false, id: "age"}],
      },
    })

    expect(names(table.getSortedRowModel().rows)).toEqual([
      "Ada",
      "Margaret",
      "Grace",
      "Mary",
    ])

    table.setSorting([{desc: false, id: "rank"}])

    expect(names(table.getSortedRowModel().rows)).toEqual([
      "Margaret",
      "Mary",
      "Ada",
      "Grace",
    ])

    table.setSorting([{desc: false, id: "status"}])

    expect(names(table.getSortedRowModel().rows)).toEqual([
      "Mary",
      "Grace",
      "Ada",
      "Margaret",
    ])
  })

  test("column sorting toggles replace, multi-add, toggle, and remove states", () => {
    const {getState, table} = createTableHarness()
    const firstName = table.getColumn("firstName")!
    const visits = table.getColumn("visits")!

    firstName.toggleSorting(false)
    expect(getState().sorting).toEqual([{desc: false, id: "firstName"}])

    visits.toggleSorting(true, true)
    expect(getState().sorting).toEqual([
      {desc: false, id: "firstName"},
      {desc: true, id: "visits"},
    ])

    visits.toggleSorting(false, true)
    expect(getState().sorting).toEqual([
      {desc: false, id: "firstName"},
      {desc: false, id: "visits"},
    ])

    visits.clearSorting()
    expect(getState().sorting).toEqual([{desc: false, id: "firstName"}])
  })

  test("grouping creates aggregate rows and the default grouped-column ordering", () => {
    const {table} = createTableHarness({
      state: {
        grouping: ["status"],
      },
    })

    const groupedRows = table.getGroupedRowModel().rows

    expect(groupedRows.map((row) => row.id)).toEqual([
      "status:single ",
      "status:relationship ",
      "status:complicated ",
    ])
    expect(groupedRows.map((row) => row.getIsGrouped())).toEqual([
      true,
      true,
      true,
    ])
    expect(groupedRows[0].getValue("visits")).toBe(37)
    expect(groupedRows[0].subRows.map((row) => row.original.firstName)).toEqual(
      ["Ada", "Margaret"],
    )
    expect(
      table
        .getAllLeafColumns()
        .map((column) => column.id)
        .slice(0, 2),
    ).toEqual(["status", "firstName"])
  })

  test("pagination clamps indexes and preserves the top row when page size changes", () => {
    const {getState, table} = createTableHarness({
      state: {
        pagination: {
          pageIndex: 1,
          pageSize: 2,
        },
      },
    })

    expect(names(table.getPaginationRowModel().rows)).toEqual([
      "Mary",
      "Margaret",
    ])
    expect(table.getPageOptions()).toEqual([0, 1])
    expect(table.getCanPreviousPage()).toBe(true)
    expect(table.getCanNextPage()).toBe(false)

    table.nextPage()
    expect(getState().pagination.pageIndex).toBe(2)

    table.setPageIndex(99)
    expect(getState().pagination.pageIndex).toBe(99)

    table.updateOptions({pageCount: 2})
    table.setPageIndex(99)
    expect(getState().pagination.pageIndex).toBe(1)

    table.setPageSize(3)
    expect(getState().pagination).toEqual({pageIndex: 0, pageSize: 3})
  })

  test("manual row-model options return pre-transformed models", () => {
    const {table} = createTableHarness({
      state: {
        columnFilters: [{id: "status", value: "single"}],
        expanded: {"1": true},
        grouping: ["status"],
        pagination: {
          pageIndex: 1,
          pageSize: 1,
        },
        sorting: [{desc: true, id: "visits"}],
      },
      tableOptions: {
        manualExpanding: true,
        manualFiltering: true,
        manualGrouping: true,
        manualPagination: true,
        manualSorting: true,
      },
    })

    expect(names(table.getFilteredRowModel().rows)).toEqual([
      "Ada",
      "Grace",
      "Mary",
      "Margaret",
    ])
    expect(names(table.getGroupedRowModel().rows)).toEqual([
      "Ada",
      "Grace",
      "Mary",
      "Margaret",
    ])
    expect(names(table.getSortedRowModel().rows)).toEqual([
      "Ada",
      "Grace",
      "Mary",
      "Margaret",
    ])
    expect(names(table.getExpandedRowModel().rows)).toEqual([
      "Ada",
      "Grace",
      "Mary",
      "Margaret",
    ])
    expect(names(table.getPaginationRowModel().rows)).toEqual([
      "Ada",
      "Grace",
      "Mary",
      "Margaret",
    ])
  })

  test("data reference changes recompute the core row model", () => {
    const {table} = createTableHarness()

    expect(names(table.getCoreRowModel().rows)).toEqual([
      "Ada",
      "Grace",
      "Mary",
      "Margaret",
    ])

    table.updateOptions({
      data: [testData[3], testData[0]],
    })

    expect(names(table.getCoreRowModel().rows)).toEqual(["Margaret", "Ada"])
  })
})
