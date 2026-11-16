import {describe, expect, test} from "vitest"

import {
  areFiltersEqual,
  countFilters,
  getFilterValue,
  isEmptyFilterValue,
  setFilterValue,
  stringifyFilterValue,
} from "./filter-panel.utils"

/**
 * Mirrors a range filter whose function treats a range with no bounds as
 * empty, such as the table's `inNumberRange.autoRemove`.
 */
function isEmptyRange(id: string, value: unknown): boolean {
  return (
    id === "visits" &&
    Array.isArray(value) &&
    value.every((bound) => bound === undefined || bound === "")
  )
}

describe("filter panel utils", () => {
  test("isEmptyFilterValue treats missing and blank values as empty", () => {
    for (const value of [undefined, null, "", []]) {
      expect(isEmptyFilterValue(undefined, "status", value)).toBe(true)
    }
    expect(isEmptyFilterValue(undefined, "status", ["single"])).toBe(false)
    expect(isEmptyFilterValue(undefined, "submitted", {preset: "7d"})).toBe(
      false,
    )
  })

  test("isEmptyFilterValue applies the consumer check after the built-in check", () => {
    expect(isEmptyFilterValue(isEmptyRange, "visits", [undefined, ""])).toBe(
      true,
    )
    expect(isEmptyFilterValue(isEmptyRange, "visits", [10, ""])).toBe(false)
    expect(isEmptyFilterValue(undefined, "visits", [undefined, ""])).toBe(false)
    expect(isEmptyFilterValue(() => false, "status", [])).toBe(true)
  })

  test("getFilterValue returns the value for an id, or undefined", () => {
    const filters = [{id: "status", value: ["single"]}]

    expect(getFilterValue(filters, "status")).toEqual(["single"])
    expect(getFilterValue(filters, "missing")).toBeUndefined()
  })

  test("setFilterValue adds, replaces in place, and removes filters", () => {
    const added = setFilterValue(undefined, [], "status", ["single"])
    expect(added).toEqual([{id: "status", value: ["single"]}])

    const withSecond = setFilterValue(undefined, added, "submitted", "7d")
    const replaced = setFilterValue(undefined, withSecond, "status", [
      "complicated",
    ])
    expect(replaced).toEqual([
      {id: "status", value: ["complicated"]},
      {id: "submitted", value: "7d"},
    ])

    expect(setFilterValue(undefined, replaced, "status", [])).toEqual([
      {id: "submitted", value: "7d"},
    ])
  })

  test("setFilterValue removes values rejected by the consumer check", () => {
    const filters = [{id: "visits", value: [10, 20]}]

    expect(
      setFilterValue(isEmptyRange, filters, "visits", [undefined, ""]),
    ).toEqual([])
  })

  test("setFilterValue applies functional updaters to the current value", () => {
    const filters = [{id: "status", value: ["single"]}]

    expect(
      setFilterValue(undefined, filters, "status", (prev: unknown) => [
        ...(prev as string[]),
        "complicated",
      ]),
    ).toEqual([{id: "status", value: ["single", "complicated"]}])
  })

  test("countFilters counts each filter id once and skips empty values", () => {
    expect(countFilters(undefined, [])).toBe(0)
    expect(
      countFilters(isEmptyRange, [
        {id: "status", value: ["single", "complicated", "relationship"]},
        {id: "submitted", value: {preset: "7d"}},
        {id: "tags", value: []},
        {id: "firstName", value: ""},
        {id: "visits", value: [undefined, ""]},
      ]),
    ).toBe(2)
  })

  test("areFiltersEqual ignores order and empty entries", () => {
    expect(
      areFiltersEqual(
        undefined,
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
        undefined,
        [{id: "status", value: ["single"]}],
        [{id: "status", value: ["complicated"]}],
      ),
    ).toBe(false)
    expect(
      areFiltersEqual(undefined, [{id: "status", value: ["single"]}], []),
    ).toBe(false)
  })

  test("stringifyFilterValue stringifies primitives and returns an empty string otherwise", () => {
    expect(stringifyFilterValue("single")).toBe("single")
    expect(stringifyFilterValue(12)).toBe("12")
    expect(stringifyFilterValue(false)).toBe("false")
    expect(stringifyFilterValue(null)).toBe("")
    expect(stringifyFilterValue({preset: "7d"})).toBe("")
  })
})
