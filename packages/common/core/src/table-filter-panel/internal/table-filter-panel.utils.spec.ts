import {describe, expect, test, vi} from "vitest"

import {createTableHarness} from "../../table/__tests__/table-test-utils"
import {
  areFiltersEqual,
  countFilters,
  createTableColumnResolver,
  isEmptyFilterValue,
  setFilterValue,
} from "./table-filter-panel.utils"

describe("table filter panel utils", () => {
  test("createTableColumnResolver resolves columns without logging for unknown ids", () => {
    const {table} = createTableHarness()
    const getColumn = createTableColumnResolver(table)
    const error = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(getColumn("status")?.id).toBe("status")
    expect(getColumn("server-only")).toBeUndefined()
    expect(error).not.toHaveBeenCalled()

    error.mockRestore()
  })

  test("isEmptyFilterValue treats missing and blank values as empty", () => {
    const getColumn = createTableColumnResolver(createTableHarness().table)

    for (const value of [undefined, null, "", []]) {
      expect(isEmptyFilterValue(getColumn, "status", value)).toBe(true)
      expect(isEmptyFilterValue(getColumn, "server-only", value)).toBe(true)
    }
    expect(isEmptyFilterValue(getColumn, "status", ["single"])).toBe(false)
    expect(isEmptyFilterValue(getColumn, "server-only", {preset: "7d"})).toBe(
      false,
    )
  })

  test("isEmptyFilterValue defers to the column filter function's autoRemove", () => {
    const getColumn = createTableColumnResolver(createTableHarness().table)

    // `visits` resolves to the inNumberRange auto filter fn.
    expect(isEmptyFilterValue(getColumn, "visits", [undefined, ""])).toBe(true)
    expect(isEmptyFilterValue(getColumn, "visits", [10, ""])).toBe(false)
  })

  test("setFilterValue adds, replaces in place, and removes filters", () => {
    const getColumn = createTableColumnResolver(createTableHarness().table)

    const added = setFilterValue(getColumn, [], "status", ["single"])
    expect(added).toEqual([{id: "status", value: ["single"]}])

    const withSecond = setFilterValue(getColumn, added, "server-only", "7d")
    const replaced = setFilterValue(getColumn, withSecond, "status", [
      "complicated",
    ])
    expect(replaced).toEqual([
      {id: "status", value: ["complicated"]},
      {id: "server-only", value: "7d"},
    ])

    expect(setFilterValue(getColumn, replaced, "status", [])).toEqual([
      {id: "server-only", value: "7d"},
    ])
  })

  test("setFilterValue applies functional updaters to the current value", () => {
    const getColumn = createTableColumnResolver(createTableHarness().table)
    const filters = [{id: "status", value: ["single"]}]

    expect(
      setFilterValue(getColumn, filters, "status", (prev: unknown) => [
        ...(prev as string[]),
        "complicated",
      ]),
    ).toEqual([{id: "status", value: ["single", "complicated"]}])
  })

  test("countFilters counts each filter id once and skips empty values", () => {
    const getColumn = createTableColumnResolver(createTableHarness().table)

    expect(countFilters(getColumn, [])).toBe(0)
    expect(
      countFilters(getColumn, [
        {id: "status", value: ["single", "complicated", "relationship"]},
        {id: "server-only", value: {preset: "7d"}},
        {id: "tags", value: []},
        {id: "firstName", value: ""},
      ]),
    ).toBe(2)
  })

  test("areFiltersEqual ignores order and empty entries", () => {
    const getColumn = createTableColumnResolver(createTableHarness().table)

    expect(
      areFiltersEqual(
        getColumn,
        [
          {id: "status", value: ["single"]},
          {id: "visits", value: [10, 20]},
        ],
        [
          {id: "visits", value: [10, 20]},
          {id: "status", value: ["single"]},
          {id: "tags", value: []},
        ],
      ),
    ).toBe(true)
    expect(
      areFiltersEqual(
        getColumn,
        [{id: "status", value: ["single"]}],
        [{id: "status", value: ["complicated"]}],
      ),
    ).toBe(false)
    expect(
      areFiltersEqual(getColumn, [{id: "status", value: ["single"]}], []),
    ).toBe(false)
  })

  test("without a column resolver, only generic empty checks apply", () => {
    expect(isEmptyFilterValue(undefined, "visits", [undefined, ""])).toBe(false)
    expect(isEmptyFilterValue(undefined, "visits", [])).toBe(true)
    expect(
      countFilters(undefined, [
        {id: "status", value: ["single"]},
        {id: "tags", value: []},
      ]),
    ).toBe(1)
  })
})
