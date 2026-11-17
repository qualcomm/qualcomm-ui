import {afterEach, describe, expect, test, vi} from "vitest"

import {createDateFilterFn, filterFns, type Row} from "../"

import {
  createTableHarness,
  makeTestColumns,
  type TestPerson,
} from "./table-test-utils"

function filteredNames(
  columnFilters: {id: string; value: unknown}[],
  columns = makeTestColumns(),
): string[] {
  const {table} = createTableHarness({columns, initialState: {columnFilters}})
  return table
    .getFilteredRowModel()
    .rows.map((row) => row.original.firstName)
    .sort()
}

function rowWith(value: unknown): Row<TestPerson> {
  return {getValue: () => value} as unknown as Row<TestPerson>
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('"auto" filter functions resolved from the filter value', () => {
  test("string arrays match scalar row values exactly", () => {
    expect(filteredNames([{id: "status", value: ["single"]}])).toEqual([
      "Ada",
      "Margaret",
    ])
  })

  test("string arrays match numeric row values by string", () => {
    expect(filteredNames([{id: "visits", value: ["12", "25", "99"]}])).toEqual([
      "Ada",
      "Margaret",
    ])
  })

  test("string arrays match array row values by intersection", () => {
    const columns = makeTestColumns().map((column) =>
      column.id === "tags" ? {...column, filterFn: "auto" as const} : column,
    )
    expect(
      filteredNames([{id: "tags", value: ["aero", "flight"]}], columns),
    ).toEqual(["Margaret", "Mary"])
  })

  test("number tuples are ranges with null as unbounded", () => {
    expect(filteredNames([{id: "visits", value: [15, null]}])).toEqual([
      "Grace",
      "Margaret",
      "Mary",
    ])
    expect(filteredNames([{id: "visits", value: [null, 12]}])).toEqual(["Ada"])
  })

  test("date range objects filter date row values", () => {
    expect(
      filteredNames([
        {
          id: "createdAt",
          value: {
            range: ["2024-02-01T00:00:00.000Z", "2024-03-01T00:00:00.000Z"],
          },
        },
      ]),
    ).toEqual(["Grace", "Mary"])
  })

  test("other values keep inference from the first row value", () => {
    expect(filteredNames([{id: "firstName", value: "ar"}])).toEqual([
      "Margaret",
      "Mary",
    ])
    expect(filteredNames([{id: "visits", value: [12, 15]}])).toEqual([
      "Ada",
      "Mary",
    ])
  })

  test("a column's own filterFn takes precedence", () => {
    const columns = makeTestColumns().map((column) =>
      column.id === "status"
        ? {...column, filterFn: "equals" as const}
        : column,
    )
    expect(filteredNames([{id: "status", value: ["single"]}], columns)).toEqual(
      [],
    )
  })

  test("auto-removal uses the function resolved for the new value", () => {
    const {table} = createTableHarness()

    table.getColumn("visits")?.setFilterValue([null, null])
    expect(table.getState().columnFilters).toEqual([])

    table.getColumn("status")?.setFilterValue([])
    expect(table.getState().columnFilters).toEqual([])

    table.getColumn("status")?.setFilterValue(["single"])
    expect(table.getState().columnFilters).toEqual([
      {id: "status", value: ["single"]},
    ])
  })

  test("two numeric strings on a number column stay a range, with a warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    expect(filteredNames([{id: "visits", value: ["12", "15"]}])).toEqual([
      "Ada",
      "Mary",
    ])

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Column "visits" received'),
    )
  })
})

describe("inDateRange", () => {
  test("date-only bounds are local dates and the end includes its whole day", () => {
    const [start, end] = filterFns.inDateRange.resolveFilterValue?.({
      range: ["2024-01-01", "2024-01-01"],
    }) as [number, number]
    const row = (date: Date) =>
      filterFns.inDateRange(rowWith(date), "date", [start, end], () => {})

    expect(row(new Date(2024, 0, 1, 0, 0))).toBe(true)
    expect(row(new Date(2024, 0, 1, 23, 59))).toBe(true)
    expect(row(new Date(2024, 0, 2, 0, 0))).toBe(false)
    expect(row(new Date(2023, 11, 31, 23, 59))).toBe(false)
  })

  test("accepts Date, epoch, and ISO string row values", () => {
    const range = filterFns.inDateRange.resolveFilterValue?.({
      range: ["2024-01-01T00:00:00.000Z", null],
    })
    const time = Date.parse("2024-06-01T00:00:00.000Z")

    for (const value of [new Date(time), time, "2024-06-01T00:00:00.000Z"]) {
      expect(
        filterFns.inDateRange(rowWith(value), "date", range, () => {}),
      ).toBe(true)
    }
    expect(
      filterFns.inDateRange(rowWith("not a date"), "date", range, () => {}),
    ).toBe(false)
  })

  test("removes empty ranges and presets", () => {
    const {autoRemove} = filterFns.inDateRange
    expect(autoRemove?.(undefined)).toBe(true)
    expect(autoRemove?.({range: [null, null]})).toBe(true)
    expect(autoRemove?.({preset: ""})).toBe(true)
    expect(autoRemove?.({range: ["2024-01-01", null]})).toBe(false)
    expect(autoRemove?.({preset: "7d"})).toBe(false)
  })

  test("warns and matches every row for presets it cannot resolve", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    expect(
      filteredNames([{id: "createdAt", value: {preset: "unresolvable"}}]),
    ).toEqual(["Ada", "Grace", "Margaret", "Mary"])
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("createDateFilterFn"),
    )
  })
})

describe("createDateFilterFn", () => {
  test("resolves presets when filtering runs", () => {
    const range = vi.fn((): [string, string] => [
      "2024-03-01T00:00:00.000Z",
      "2024-04-01T00:00:00.000Z",
    ])
    const columns = makeTestColumns().map((column) =>
      column.id === "createdAt"
        ? {
            ...column,
            filterFn: createDateFilterFn([
              {label: "Spring", range, value: "spring"},
            ]),
          }
        : column,
    )

    expect(
      filteredNames([{id: "createdAt", value: {preset: "spring"}}], columns),
    ).toEqual(["Margaret", "Mary"])
    expect(range).toHaveBeenCalled()
    expect(
      filteredNames(
        [
          {
            id: "createdAt",
            value: {range: ["2024-01-01T00:00:00.000Z", null]},
          },
        ],
        columns,
      ),
    ).toEqual(["Ada", "Grace", "Margaret", "Mary"])
  })

  test("resolves built-in presets relative to the current date", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-02-15T12:00:00.000Z"))
    try {
      const columns = makeTestColumns().map((column) =>
        column.id === "createdAt"
          ? {
              ...column,
              filterFn: createDateFilterFn(
                [{label: "Last 30 days", value: "last30Days"}],
                {timeZone: "UTC"},
              ),
            }
          : column,
      )

      expect(
        filteredNames(
          [{id: "createdAt", value: {preset: "last30Days"}}],
          columns,
        ),
      ).toEqual(["Grace"])
    } finally {
      vi.useRealTimers()
    }
  })
})
