import {describe, expect, test} from "vitest"

import {
  customFilter,
  dateFilter,
  defineFilters,
  listFilter,
  rangeFilter,
  textFilter,
} from "./filters.definitions"
import {
  countFilterValue,
  getFilterValueItems,
  isEmptyDateFilterValue,
  isEmptyFilterValue,
  removeFilterValueItem,
  stringifyFilterValue,
} from "./filters.utils"

const definitions = defineFilters({
  duration: rangeFilter({formatValue: (value) => `${value} min`}),
  query: textFilter(),
  status: listFilter(),
  submitted: dateFilter({
    presets: [{label: "Last 7 days", value: "last7Days"}],
  }),
  tags: customFilter<{all: boolean; tags: string[]}>({
    getValueCount: (value) => value.tags.length,
    getValueItems: (value) =>
      value.tags.map((tag) => ({label: tag, value: tag})),
    isEmptyValue: (value) => value.tags.length === 0,
  }),
})

describe("isEmptyFilterValue", () => {
  test("blank values are empty with or without a definition", () => {
    for (const value of [undefined, null, "", []]) {
      expect(isEmptyFilterValue(definitions.status, value)).toBe(true)
      expect(isEmptyFilterValue(undefined, value)).toBe(true)
    }
    expect(isEmptyFilterValue(definitions.status, ["Failed"])).toBe(false)
  })

  test("unbounded ranges and dates are empty", () => {
    expect(isEmptyFilterValue(definitions.duration, [null, null])).toBe(true)
    expect(isEmptyFilterValue(definitions.duration, [10, null])).toBe(false)
    expect(
      isEmptyFilterValue(definitions.submitted, {range: [null, null]}),
    ).toBe(true)
    expect(
      isEmptyFilterValue(definitions.submitted, {range: ["2026-11-01", null]}),
    ).toBe(false)
    expect(isEmptyFilterValue(definitions.submitted, {preset: ""})).toBe(true)
    expect(
      isEmptyFilterValue(definitions.submitted, {preset: "last7Days"}),
    ).toBe(false)
  })

  test("custom definitions decide with their own isEmptyValue", () => {
    expect(isEmptyFilterValue(definitions.tags, {all: true, tags: []})).toBe(
      true,
    )
    expect(isEmptyFilterValue(definitions.tags, {all: true, tags: ["a"]})).toBe(
      false,
    )
  })
})

describe("isEmptyDateFilterValue", () => {
  test("treats blank bounds and presets as empty", () => {
    expect(isEmptyDateFilterValue(undefined)).toBe(true)
    expect(isEmptyDateFilterValue({range: ["", null]})).toBe(true)
    expect(isEmptyDateFilterValue({preset: ""})).toBe(true)
    expect(isEmptyDateFilterValue({range: ["2024-01-01", null]})).toBe(false)
    expect(isEmptyDateFilterValue({preset: "last7Days"})).toBe(false)
  })
})

describe("countFilterValue", () => {
  test("counts array items and one per other value", () => {
    expect(countFilterValue(definitions.status, ["a", "b"])).toBe(2)
    expect(countFilterValue(definitions.duration, [10, 20])).toBe(1)
    expect(countFilterValue(definitions.submitted, {preset: "last7Days"})).toBe(
      1,
    )
    expect(countFilterValue(definitions.query, "out/")).toBe(1)
    expect(
      countFilterValue(definitions.tags, {all: false, tags: ["a", "b"]}),
    ).toBe(2)
    expect(countFilterValue(undefined, ["x"])).toBe(1)
  })
})

describe("getFilterValueItems", () => {
  const getOptionLabel = (option: string) => option.toUpperCase()

  test("list values have one item per option", () => {
    expect(
      getFilterValueItems(definitions.status, ["a", "b"], getOptionLabel),
    ).toEqual([
      {label: "A", value: "a"},
      {label: "B", value: "b"},
    ])
  })

  test("range, date, and text values have one item for the whole value", () => {
    expect(
      getFilterValueItems(definitions.duration, [10, null], getOptionLabel),
    ).toEqual([{label: "≥ 10 min", value: "≥ 10 min"}])
    expect(
      getFilterValueItems(definitions.duration, [10, 20], getOptionLabel),
    ).toEqual([{label: "10 min – 20 min", value: "10 min – 20 min"}])
    expect(
      getFilterValueItems(
        definitions.submitted,
        {preset: "last7Days"},
        getOptionLabel,
      ),
    ).toEqual([{label: "Last 7 days", value: "Last 7 days"}])
    expect(
      getFilterValueItems(
        definitions.submitted,
        {range: [null, "2026-11-09"]},
        getOptionLabel,
      ),
    ).toEqual([{label: "≤ 2026-11-09", value: "≤ 2026-11-09"}])
    expect(
      getFilterValueItems(definitions.query, "out/", getOptionLabel),
    ).toEqual([{label: "out/", value: "out/"}])
  })

  test("custom values use the definition's items", () => {
    expect(
      getFilterValueItems(
        definitions.tags,
        {all: true, tags: ["x", "y"]},
        getOptionLabel,
      ),
    ).toEqual([
      {label: "x", value: "x"},
      {label: "y", value: "y"},
    ])
  })
})

describe("removeFilterValueItem", () => {
  test("removes one option from a list value", () => {
    expect(removeFilterValueItem(definitions.status, ["a", "b"], "a")).toEqual([
      "b",
    ])
  })

  test("clears range, date, and text values", () => {
    expect(
      removeFilterValueItem(definitions.duration, [10, 20], "10 min – 20 min"),
    ).toBeUndefined()
    expect(
      removeFilterValueItem(
        definitions.submitted,
        {preset: "last7Days"},
        "Last 7 days",
      ),
    ).toBeUndefined()
    expect(
      removeFilterValueItem(definitions.query, "out/", "out/"),
    ).toBeUndefined()
  })

  test("removes matching elements from custom array values", () => {
    const flags = customFilter<number[]>({})
    expect(removeFilterValueItem(flags, [1, 2, 3], "2")).toEqual([1, 3])
  })
})

describe("stringifyFilterValue", () => {
  test("stringifies primitives only", () => {
    expect(stringifyFilterValue("single")).toBe("single")
    expect(stringifyFilterValue(12)).toBe("12")
    expect(stringifyFilterValue(false)).toBe("false")
    expect(stringifyFilterValue(null)).toBe("")
    expect(stringifyFilterValue({preset: "last7Days"})).toBe("")
  })
})
