import {describe, expect, test} from "vitest"

import {
  aggregationFns,
  filterFns,
  functionalUpdate,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  sortingFns,
} from "../"
import {getFacetedUniqueValues} from "../utils/get-faceted-unique-values"

import {createTableHarness, testData} from "./table-test-utils"

describe("table built-in filter functions regression", () => {
  test("string, equality, array, and number filters return expected matches", () => {
    const {table} = createTableHarness()
    const ada = table.getCoreRowModel().rows[0]
    const grace = table.getCoreRowModel().rows[1]

    expect(
      filterFns.includesString(ada, "firstName", "AD", () => undefined),
    ).toBe(true)
    expect(
      filterFns.includesStringSensitive(
        ada,
        "firstName",
        "ad",
        () => undefined,
      ),
    ).toBe(false)
    expect(
      filterFns.equalsString(ada, "firstName", "ada", () => undefined),
    ).toBe(true)
    expect(
      filterFns.equals(grace, "status", "relationship", () => undefined),
    ).toBe(true)
    expect(filterFns.weakEquals(ada, "visits", "12", () => undefined)).toBe(
      true,
    )
    expect(filterFns.arrIncludes(ada, "tags", "math", () => undefined)).toBe(
      true,
    )
    expect(
      filterFns.arrIncludesAll(
        ada,
        "tags",
        ["math", "systems"],
        () => undefined,
      ),
    ).toBe(true)
    expect(
      filterFns.arrIncludesSome(
        ada,
        "tags",
        ["flight", "math"],
        () => undefined,
      ),
    ).toBe(true)
    const normalizedRange = filterFns.inNumberRange.resolveFilterValue?.([
      "45",
      "40",
    ])

    expect(
      filterFns.inNumberRange(grace, "age", normalizedRange, () => undefined),
    ).toBe(true)
  })

  test("filter auto-remove functions remove empty values only", () => {
    expect(filterFns.includesString.autoRemove?.("")).toBe(true)
    expect(filterFns.includesString.autoRemove?.("ada")).toBe(false)
    expect(filterFns.arrIncludes.autoRemove?.("")).toBe(true)
    expect(filterFns.arrIncludes.autoRemove?.("systems")).toBe(false)
    expect(filterFns.inNumberRange.autoRemove?.([undefined, ""])).toBe(true)
    expect(filterFns.inNumberRange.autoRemove?.([10, ""])).toBe(false)
  })
})

describe("table built-in sorting functions regression", () => {
  test("basic, text, alphanumeric, and datetime sorters compare rows predictably", () => {
    const {table} = createTableHarness()
    const [ada, grace] = table.getCoreRowModel().rows

    expect(sortingFns.basic(ada, grace, "visits")).toBeLessThan(0)
    expect(sortingFns.text(ada, grace, "firstName")).toBeLessThan(0)
    expect(sortingFns.alphanumeric(ada, grace, "lastName")).toBeGreaterThan(0)
    expect(sortingFns.datetime(ada, grace, "createdAt")).toBeLessThan(0)
  })
})

describe("table built-in aggregation functions regression", () => {
  test("numeric aggregations ignore non-numeric values and date extent returns min/max", () => {
    const {table} = createTableHarness()
    const rows = table.getCoreRowModel().rows

    expect(aggregationFns.sum("visits", rows, rows)).toBe(72)
    expect(aggregationFns.min("visits", rows, rows)).toBe(12)
    expect(aggregationFns.max("visits", rows, rows)).toBe(25)
    expect(aggregationFns.mean("age", rows, rows)).toBe(36)
    expect(aggregationFns.median("visits", rows, rows)).toBe(17.5)
    expect(aggregationFns.unique("status", rows, rows)).toEqual([
      "single",
      "relationship",
      "complicated",
    ])
    expect(aggregationFns.uniqueCount("status", rows, rows)).toBe(3)
    expect(aggregationFns.count("status", rows, rows)).toBe(4)
    expect(aggregationFns.extent("createdAt", rows, rows)).toEqual([
      new Date("2024-01-01T00:00:00.000Z"),
      new Date("2024-04-01T00:00:00.000Z"),
    ])
  })
})

describe("table faceting and utility regression", () => {
  test("faceted row, unique value, and min/max helpers derive values from filtered rows", () => {
    const {table} = createTableHarness({
      state: {
        columnFilters: [{id: "status", value: "single"}],
      },
      tableOptions: {
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
      },
    })

    expect(table.getColumn("visits")?.getFacetedMinMaxValues()).toEqual([
      12, 25,
    ])
    expect(
      Array.from(table.getColumn("status")!.getFacetedUniqueValues().entries()),
    ).toEqual([
      ["single", 3],
      ["complicated", 2],
      ["relationship", 1],
    ])
    expect(
      table
        .getColumn("status")
        ?.getFacetedRowModel()
        .rows.map((row) => row.id),
    ).toEqual(["0", "1", "2", "3"])
  })

  test("faceted min/max skips undefined leading values", () => {
    const {table} = createTableHarness({
      data: [testData[2], testData[0], testData[3]],
      tableOptions: {
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        getFacetedRowModel: getFacetedRowModel(),
      },
    })

    expect(table.getColumn("age")?.getFacetedMinMaxValues()).toEqual([31, 35])
  })

  test("faceted min/max skips invalid values and returns undefined when no numbers exist", () => {
    const {table: mixedTable} = createTableHarness({
      data: [
        {...testData[0], age: "unknown" as unknown as number},
        {...testData[1], age: Number.NaN, subRows: undefined},
        testData[2],
        {...testData[3], age: 35},
      ],
      tableOptions: {
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        getFacetedRowModel: getFacetedRowModel(),
      },
    })

    expect(mixedTable.getColumn("age")?.getFacetedMinMaxValues()).toEqual([
      35, 35,
    ])

    const {table: invalidTable} = createTableHarness({
      data: [
        {...testData[0], age: "unknown" as unknown as number},
        {...testData[1], age: Number.NaN, subRows: undefined},
        testData[2],
      ],
      tableOptions: {
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        getFacetedRowModel: getFacetedRowModel(),
      },
    })

    expect(
      invalidTable.getColumn("age")?.getFacetedMinMaxValues(),
    ).toBeUndefined()
  })

  test("functionalUpdate applies values and updater functions", () => {
    expect(functionalUpdate(3, 1)).toBe(3)
    expect(functionalUpdate((value: number) => value + 2, 1)).toBe(3)
  })
})
