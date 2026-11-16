import {describe, expect, test, vi} from "vitest"

import {createTableHarness} from "../../table/__tests__/table-test-utils"
import {
  areFiltersEqual,
  countFilters,
  findColumn,
  getIdentityKey,
  isEmptyFilterValue,
  setFilterValue,
} from "../internal/table-filter-panel.utils"

describe("table filter panel utils", () => {
  test("findColumn resolves columns without logging for unknown ids", () => {
    const {table} = createTableHarness()
    const error = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(findColumn(table, "status")?.id).toBe("status")
    expect(findColumn(table, "server-only")).toBeUndefined()
    expect(error).not.toHaveBeenCalled()

    error.mockRestore()
  })

  test("isEmptyFilterValue treats missing and blank values as empty", () => {
    const {table} = createTableHarness()

    for (const value of [undefined, null, "", []]) {
      expect(isEmptyFilterValue(table, "status", value)).toBe(true)
      expect(isEmptyFilterValue(table, "server-only", value)).toBe(true)
    }
    expect(isEmptyFilterValue(table, "status", ["single"])).toBe(false)
    expect(isEmptyFilterValue(table, "server-only", {preset: "7d"})).toBe(false)
  })

  test("isEmptyFilterValue defers to the column filter function's autoRemove", () => {
    const {table} = createTableHarness()

    // `visits` resolves to the inNumberRange auto filter fn.
    expect(isEmptyFilterValue(table, "visits", [undefined, ""])).toBe(true)
    expect(isEmptyFilterValue(table, "visits", [10, ""])).toBe(false)
  })

  test("setFilterValue adds, replaces in place, and removes filters", () => {
    const {table} = createTableHarness()

    const added = setFilterValue(table, [], "status", ["single"])
    expect(added).toEqual([{id: "status", value: ["single"]}])

    const withSecond = setFilterValue(table, added, "server-only", "7d")
    const replaced = setFilterValue(table, withSecond, "status", [
      "complicated",
    ])
    expect(replaced).toEqual([
      {id: "status", value: ["complicated"]},
      {id: "server-only", value: "7d"},
    ])

    expect(setFilterValue(table, replaced, "status", [])).toEqual([
      {id: "server-only", value: "7d"},
    ])
  })

  test("setFilterValue applies functional updaters to the current value", () => {
    const {table} = createTableHarness()
    const filters = [{id: "status", value: ["single"]}]

    expect(
      setFilterValue(table, filters, "status", (prev: unknown) => [
        ...(prev as string[]),
        "complicated",
      ]),
    ).toEqual([{id: "status", value: ["single", "complicated"]}])
  })

  test("countFilters counts each filter id once and skips empty values", () => {
    const {table} = createTableHarness()

    expect(countFilters(table, [])).toBe(0)
    expect(
      countFilters(table, [
        {id: "status", value: ["single", "complicated", "relationship"]},
        {id: "server-only", value: {preset: "7d"}},
        {id: "tags", value: []},
        {id: "firstName", value: ""},
      ]),
    ).toBe(2)
  })

  test("areFiltersEqual ignores order and empty entries", () => {
    const {table} = createTableHarness()

    expect(
      areFiltersEqual(
        table,
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
        table,
        [{id: "status", value: ["single"]}],
        [{id: "status", value: ["complicated"]}],
      ),
    ).toBe(false)
    expect(
      areFiltersEqual(table, [{id: "status", value: ["single"]}], []),
    ).toBe(false)
  })

  test("getIdentityKey is stable per reference", () => {
    const a: unknown[] = []
    const b: unknown[] = []

    expect(getIdentityKey(a)).toBe(getIdentityKey(a))
    expect(getIdentityKey(a)).not.toBe(getIdentityKey(b))
  })
})
