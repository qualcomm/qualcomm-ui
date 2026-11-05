import {afterEach, describe, expect, test, vi} from "vitest"

import {
  type ColumnDef,
  createColumnHelper,
  createTable,
  getCoreRowModel,
  type TableState,
  type Updater,
} from "../"

import {
  createTableHarness,
  defaultTableState,
  groupedColumns,
  testColumns,
  testData,
  type TestPerson,
} from "./table-test-utils"

describe("table core regression", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test("builds nested columns, visible leaf columns, and header spans", () => {
    const {table} = createTableHarness({columns: groupedColumns})

    expect(table.getAllColumns().map((column) => column.id)).toEqual([
      "name",
      "metrics",
      "status",
    ])
    expect(table.getAllFlatColumns().map((column) => column.id)).toEqual([
      "name",
      "firstName",
      "lastName",
      "metrics",
      "age",
      "visits",
      "status",
    ])
    expect(table.getAllLeafColumns().map((column) => column.id)).toEqual([
      "firstName",
      "lastName",
      "age",
      "visits",
      "status",
    ])

    const headerGroups = table.getHeaderGroups()

    expect(headerGroups).toHaveLength(2)
    expect(headerGroups[0].headers.map((header) => header.column.id)).toEqual([
      "name",
      "metrics",
      "status",
    ])
    expect(headerGroups[0].headers.map((header) => header.colSpan)).toEqual([
      2, 2, 1,
    ])
    expect(headerGroups[1].headers.map((header) => header.column.id)).toEqual([
      "firstName",
      "lastName",
      "age",
      "visits",
      "status",
    ])
    expect(
      table
        .getFooterGroups()
        .map((group) => group.headers.map((header) => header.column.id)),
    ).toEqual([
      ["firstName", "lastName", "age", "visits", "status"],
      ["name", "metrics", "status"],
    ])
  })

  test("creates rows with parent lookup, leaf rows, and unique values", () => {
    const {table} = createTableHarness()
    const rowModel = table.getCoreRowModel()
    const rowByFirstName = (firstName: string) => {
      const row = rowModel.flatRows.find(
        (row) => row.original.firstName === firstName,
      )

      expect(row).toBeDefined()

      return row!
    }

    expect(rowModel.rows.map((row) => row.original.firstName)).toEqual([
      "Ada",
      "Grace",
      "Mary",
      "Margaret",
    ])
    expect(rowModel.flatRows.map((row) => row.original.firstName)).toEqual([
      "Ada",
      "Grace",
      "Katherine",
      "Dorothy",
      "Mary",
      "Margaret",
    ])

    const ada = rowByFirstName("Ada")
    const grace = rowByFirstName("Grace")
    const katherine = rowByFirstName("Katherine")

    expect(grace.getValue("firstName")).toBe("Grace")
    expect(katherine.getParentRow()?.original.firstName).toBe("Grace")
    expect(
      katherine.getParentRows().map((row) => row.original.firstName),
    ).toEqual(["Grace"])
    expect(grace.getLeafRows().map((row) => row.original.firstName)).toEqual([
      "Katherine",
      "Dorothy",
    ])
    expect(ada.getUniqueValues("tags")).toEqual(["math", "systems"])
  })

  test("uses custom row IDs without breaking nested parent lookup", () => {
    const {table} = createTableHarness({
      tableOptions: {
        getRowId: (row, index, parent) =>
          parent
            ? `${parent.id}.${row.lastName.toLowerCase()}`
            : `${index}-${row.firstName.toLowerCase()}`,
      },
    })

    expect(table.getCoreRowModel().flatRows.map((row) => row.id)).toEqual([
      "0-ada",
      "1-grace",
      "1-grace.johnson",
      "1-grace.vaughan",
      "2-mary",
      "3-margaret",
    ])
    expect(table.getRow("1-grace.johnson", true).getParentRow()?.id).toBe(
      "1-grace",
    )
  })

  test("exposes cell value and render context", () => {
    const {table} = createTableHarness()
    const firstCell = table.getCoreRowModel().rows[0].getAllCells()[0]

    expect(firstCell.column.id).toBe("firstName")
    expect(firstCell.getValue()).toBe("Ada")
    expect(firstCell.getContext()).toMatchObject({
      cell: firstCell,
      column: firstCell.column,
      row: firstCell.row,
      table,
    })
    expect(firstCell.getContext().getValue()).toBe("Ada")
  })

  test("supports deep accessor keys and warns when an intermediate key is absent", () => {
    type NestedPerson = TestPerson & {
      profile?: {
        contact?: {
          email?: string
        }
      }
    }

    const helper = createColumnHelper<NestedPerson>()
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)

    const columns: ColumnDef<NestedPerson, string | undefined>[] = [
      helper.accessor("profile.contact.email", {
        header: "Email",
        id: "profileEmail",
      }),
    ]
    const data: NestedPerson[] = [
      {
        ...testData[0],
        profile: {
          contact: {
            email: "ada@example.test",
          },
        },
      },
      {
        ...testData[1],
        profile: {},
      },
    ]
    let state: TableState = defaultTableState()

    const table = createTable<NestedPerson>({
      columns,
      data,
      getCoreRowModel: getCoreRowModel(),
      onStateChange(updater: Updater<TableState>) {
        state = typeof updater === "function" ? updater(state) : updater
        table.updateOptions({state})
      },
      renderFallbackValue: "",
      state,
    })

    expect(table.getCoreRowModel().rows[0].getValue("profileEmail")).toBe(
      "ada@example.test",
    )
    expect(table.getCoreRowModel().rows[1].getValue("profileEmail")).toBe(
      undefined,
    )
    expect(warn).toHaveBeenCalledTimes(2)
    expect(warn).toHaveBeenCalledWith(
      '"contact" in deeply nested key "profile.contact.email" returned undefined.',
    )
    expect(warn).toHaveBeenCalledWith(
      '"email" in deeply nested key "profile.contact.email" returned undefined.',
    )
  })

  test("throws a useful error for function accessors without a stable ID", () => {
    const helper = createColumnHelper<TestPerson>()
    const columns: ColumnDef<TestPerson, string>[] = [
      helper.accessor((row) => row.firstName, {
        header: () => "First Name",
      }),
    ]

    const {table} = createTableHarness({columns})

    expect(() => table.getAllColumns()).toThrow(
      "Columns require an id when using an accessorFn",
    )
  })

  test("reset restores the resolved initial table state", () => {
    const {getState, table} = createTableHarness({
      initialState: {
        columnVisibility: {
          visits: false,
        },
        pagination: {
          pageIndex: 1,
          pageSize: 2,
        },
        sorting: [{desc: false, id: "firstName"}],
      },
      state: {
        columnVisibility: {},
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
        sorting: [],
      },
    })

    table.reset()

    expect(getState().columnVisibility).toEqual({visits: false})
    expect(getState().pagination).toEqual({pageIndex: 1, pageSize: 2})
    expect(getState().sorting).toEqual([{desc: false, id: "firstName"}])
  })

  test("logs and returns undefined for unknown columns", () => {
    const {table} = createTableHarness({columns: testColumns})
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined)

    expect(table.getColumn("missing")).toBeUndefined()
    expect(error).toHaveBeenCalledTimes(1)
    expect(error).toHaveBeenCalledWith(
      "[Table] Column with id 'missing' does not exist.",
    )
  })
})
