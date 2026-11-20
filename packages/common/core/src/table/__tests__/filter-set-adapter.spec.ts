import {afterEach, describe, expect, test, vi} from "vitest"

import {ListCollection} from "@qualcomm-ui/utils/collection"

import {
  createColumnHelper,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getTableFilterSetProps,
} from "../"

import {
  createTableHarness,
  makeTestColumns,
  type TestPerson,
} from "./table-test-utils"

const columnHelper = createColumnHelper<TestPerson>()

function getCollection(
  props: ReturnType<typeof getTableFilterSetProps>,
  id: string,
): ListCollection<any> | undefined {
  const collection = props.getFilterCollection(id, {values: []})?.collection
  return collection instanceof ListCollection ? collection : undefined
}

const faceting = {
  getFacetedMinMaxValues: getFacetedMinMaxValues<TestPerson>(),
  getFacetedRowModel: getFacetedRowModel<TestPerson>(),
  getFacetedUniqueValues: getFacetedUniqueValues<TestPerson>(),
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe("getTableFilterSetProps", () => {
  test("passes the table's column filters through as a record", () => {
    const {table} = createTableHarness({
      initialState: {
        columnFilters: [
          {id: "status", value: ["single"]},
          {id: "visits", value: [10, null]},
        ],
      },
    })

    expect(getTableFilterSetProps(table).value).toEqual({
      status: ["single"],
      visits: [10, null],
    })
  })

  test("onValueChange writes the record to the table's column filters", () => {
    const {table} = createTableHarness()

    getTableFilterSetProps(table).onValueChange({
      status: ["single"],
      visits: [10, null],
    })

    expect(table.getState().columnFilters).toEqual([
      {id: "status", value: ["single"]},
      {id: "visits", value: [10, null]},
    ])
  })

  test("isEmptyValue uses the autoRemove of the function resolved for the value", () => {
    const {table} = createTableHarness()
    const {isEmptyValue} = getTableFilterSetProps(table)

    expect(isEmptyValue("visits", [undefined, ""])).toBe(true)
    expect(isEmptyValue("visits", [10, null])).toBe(false)
    expect(isEmptyValue("status", [])).toBe(true)
    expect(isEmptyValue("createdAt", {range: [null, null]})).toBe(true)
  })

  test("labels resolve from the column", () => {
    const {table} = createTableHarness({
      columns: [
        columnHelper.accessor("status", {
          filterLabel: "Relationship status",
          getFilterOptionLabel: (value) =>
            value === "single" ? "Single" : String(value),
          header: "Status",
        }),
      ],
    })
    const props = getTableFilterSetProps(table)

    expect(props.getFilterLabel("status")).toBe("Relationship status")
    expect(getCollection(props, "status")?.stringify("single")).toBe("Single")
  })

  test("warns when a non-string header leaves the label as the column id", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const {table} = createTableHarness({
      columns: [columnHelper.accessor("status", {header: () => "Status"})],
    })

    expect(getTableFilterSetProps(table).getFilterLabel("status")).toBe(
      "status",
    )
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("filterLabel"))
  })

  test("collections hold every value across all rows, flattened and sorted by label", () => {
    const {table} = createTableHarness({tableOptions: faceting})
    const props = getTableFilterSetProps(table)

    expect(getCollection(props, "status")?.items).toEqual([
      {label: "complicated", value: "complicated"},
      {label: "relationship", value: "relationship"},
      {label: "single", value: "single"},
    ])
    expect(getCollection(props, "tags")?.getValues()).toEqual([
      "aero",
      "compiler",
      "flight",
      "math",
      "systems",
    ])
  })

  test("values stay in the collection when other filters exclude their rows", () => {
    const {table} = createTableHarness({
      initialState: {columnFilters: [{id: "status", value: ["single"]}]},
      tableOptions: faceting,
    })

    expect(
      getCollection(getTableFilterSetProps(table), "tags")?.getValues(),
    ).toEqual(["aero", "compiler", "flight", "math", "systems"])
  })

  test("range bounds come from faceted min and max values", () => {
    const {table} = createTableHarness({tableOptions: faceting})

    expect(getTableFilterSetProps(table).getFilterRange("visits")).toEqual({
      max: 25,
      min: 5,
    })
  })

  test("collections don't need faceting, but range bounds warn without it", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const {table} = createTableHarness({
      columns: makeTestColumns(),
      tableOptions: {getFacetedRowModel: undefined},
    })
    const props = getTableFilterSetProps(table)

    expect(getCollection(props, "lastName")?.items.length).toBeGreaterThan(0)
    expect(props.getFilterRange("rank")).toBeUndefined()
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("getFacetedMinMaxValues"),
    )
  })

  test("warns instead of building a collection from the loaded rows of a manually filtered table", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const {table} = createTableHarness({
      tableOptions: {...faceting, manualFiltering: true},
    })

    expect(
      getTableFilterSetProps(table).getFilterCollection("status", {values: []}),
    ).toBeUndefined()
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("manualFiltering"),
    )
  })

  test("ids without a matching column fall back without logging errors", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    vi.spyOn(console, "warn").mockImplementation(() => {})
    const {table} = createTableHarness()
    const {getFilterCollection, getFilterLabel, isEmptyValue} =
      getTableFilterSetProps(table)

    expect(getFilterLabel("server-only")).toBeUndefined()
    expect(getFilterCollection("server-only", {values: []})).toBeUndefined()
    expect(isEmptyValue("server-only", "7d")).toBe(false)
    expect(error).not.toHaveBeenCalled()
  })

  test("option counts come from faceted values and ignore the column's own filter", () => {
    const {table} = createTableHarness({
      initialState: {columnFilters: [{id: "status", value: ["single"]}]},
      tableOptions: faceting,
    })
    const {getFilterOptionCounts, value} = getTableFilterSetProps(table)

    expect(getFilterOptionCounts("status", value)).toEqual(
      new Map([
        ["complicated", 2],
        ["relationship", 1],
        ["single", 3],
      ]),
    )
    expect(getFilterOptionCounts("tags", value)).toEqual(
      new Map([
        ["flight", 1],
        ["math", 1],
        ["systems", 2],
      ]),
    )
  })

  test("option counts follow a draft that differs from the committed filters", () => {
    const committed = createTableHarness({
      initialState: {columnFilters: [{id: "status", value: ["single"]}]},
      tableOptions: faceting,
    })
    const {table} = createTableHarness({tableOptions: faceting})
    const draft = {status: ["single"]}
    const {getFilterOptionCounts} = getTableFilterSetProps(table)

    expect(getFilterOptionCounts("tags", draft)).toEqual(
      getTableFilterSetProps(committed.table).getFilterOptionCounts(
        "tags",
        draft,
      ),
    )
    expect(getFilterOptionCounts("status", draft)).toEqual(
      getTableFilterSetProps(table).getFilterOptionCounts("status", {}),
    )
  })

  test("option counts are undefined without client-side faceting", () => {
    const manual = createTableHarness({
      tableOptions: {...faceting, manualFiltering: true},
    })
    const unfaceted = createTableHarness()

    expect(
      getTableFilterSetProps(manual.table).getFilterOptionCounts("status", {}),
    ).toBeUndefined()
    expect(
      getTableFilterSetProps(unfaceted.table).getFilterOptionCounts(
        "status",
        {},
      ),
    ).toBeUndefined()
  })
})
