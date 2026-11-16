import {describe, expect, test} from "vitest"

import type {FilterPanelFilter} from "../filter-panel.types"

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
function isEmptyRange({id, value}: FilterPanelFilter): boolean {
  return (
    id === "visits" &&
    Array.isArray(value) &&
    value.every((bound) => bound === undefined || bound === "")
  )
}

describe("filter panel utils", () => {
  test("isEmptyFilterValue treats missing and blank values as empty", () => {
    for (const value of [undefined, null, "", []]) {
      expect(isEmptyFilterValue(undefined, {id: "status", value})).toBe(true)
    }
    expect(
      isEmptyFilterValue(undefined, {id: "status", value: ["single"]}),
    ).toBe(false)
    expect(
      isEmptyFilterValue(undefined, {id: "submitted", value: {preset: "7d"}}),
    ).toBe(false)
  })

  test("isEmptyFilterValue applies the consumer check after the built-in check", () => {
    expect(
      isEmptyFilterValue(isEmptyRange, {id: "visits", value: [undefined, ""]}),
    ).toBe(true)
    expect(
      isEmptyFilterValue(isEmptyRange, {id: "visits", value: [10, ""]}),
    ).toBe(false)
    expect(
      isEmptyFilterValue(undefined, {id: "visits", value: [undefined, ""]}),
    ).toBe(false)
    expect(isEmptyFilterValue(() => false, {id: "status", value: []})).toBe(
      true,
    )
  })

  test("isEmptyFilterValue passes the filter type to the consumer check", () => {
    const isEmptyFullRange = ({type, value}: FilterPanelFilter) =>
      type === "range" &&
      Array.isArray(value) &&
      value.every((bound) => bound === null)

    expect(
      isEmptyFilterValue(isEmptyFullRange, {
        id: "visits",
        type: "range",
        value: [null, null],
      }),
    ).toBe(true)
    expect(
      isEmptyFilterValue(isEmptyFullRange, {id: "visits", value: [null, null]}),
    ).toBe(false)
  })

  test("getFilterValue returns the value for an id, or undefined", () => {
    const filters = [{id: "status", value: ["single"]}]

    expect(getFilterValue(filters, "status")).toEqual(["single"])
    expect(getFilterValue(filters, "missing")).toBeUndefined()
  })

  test("setFilterValue adds, replaces in place, and removes filters", () => {
    const added = setFilterValue(undefined, [], {
      id: "status",
      value: ["single"],
    })
    expect(added).toEqual([{id: "status", value: ["single"]}])

    const withSecond = setFilterValue(undefined, added, {
      id: "submitted",
      value: "7d",
    })
    const replaced = setFilterValue(undefined, withSecond, {
      id: "status",
      value: ["complicated"],
    })
    expect(replaced).toEqual([
      {id: "status", value: ["complicated"]},
      {id: "submitted", value: "7d"},
    ])

    expect(
      setFilterValue(undefined, replaced, {id: "status", value: []}),
    ).toEqual([{id: "submitted", value: "7d"}])
  })

  test("setFilterValue removes values rejected by the consumer check", () => {
    const filters = [{id: "visits", value: [10, 20]}]

    expect(
      setFilterValue(isEmptyRange, filters, {
        id: "visits",
        value: [undefined, ""],
      }),
    ).toEqual([])
  })

  test("setFilterValue applies functional updaters to the current value", () => {
    const filters = [{id: "status", value: ["single"]}]

    expect(
      setFilterValue(undefined, filters, {
        id: "status",
        value: (prev: unknown) => [...(prev as string[]), "complicated"],
      }),
    ).toEqual([{id: "status", value: ["single", "complicated"]}])
  })

  test("setFilterValue records the filter type", () => {
    expect(
      setFilterValue(undefined, [], {
        id: "status",
        type: "checkbox",
        value: ["single"],
      }),
    ).toStrictEqual([{id: "status", type: "checkbox", value: ["single"]}])
  })

  test("setFilterValue keeps the existing type when the update omits it", () => {
    const filters: FilterPanelFilter[] = [
      {id: "status", type: "checkbox", value: ["single", "complicated"]},
    ]

    expect(
      setFilterValue(undefined, filters, {id: "status", value: ["single"]}),
    ).toStrictEqual([{id: "status", type: "checkbox", value: ["single"]}])
    expect(
      setFilterValue(undefined, filters, {
        id: "status",
        type: "combobox",
        value: ["single"],
      }),
    ).toStrictEqual([{id: "status", type: "combobox", value: ["single"]}])
  })

  test("setFilterValue omits the type key for untyped filters", () => {
    expect(
      setFilterValue(undefined, [], {id: "status", value: "single"}),
    ).toStrictEqual([{id: "status", value: "single"}])
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
    expect(
      areFiltersEqual(
        undefined,
        [{id: "status", type: "checkbox", value: ["single"]}],
        [{id: "status", type: "combobox", value: ["single"]}],
      ),
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
