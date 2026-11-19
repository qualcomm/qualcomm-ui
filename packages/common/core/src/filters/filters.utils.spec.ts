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
  labelFilterValue,
  isEmptyDateFilterValue,
  isEmptyFilterValue,
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
    getValueLabels: (value) => value.tags,
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

describe("labelFilterValue", () => {
  const getOptionLabel = (option: string) => option.toUpperCase()

  test("summarizes each kind of value", () => {
    expect(
      labelFilterValue(definitions.status, ["a", "b"], getOptionLabel),
    ).toEqual(["A", "B"])
    expect(
      labelFilterValue(definitions.duration, [10, null], getOptionLabel),
    ).toEqual(["≥ 10 min"])
    expect(
      labelFilterValue(definitions.duration, [10, 20], getOptionLabel),
    ).toEqual(["10 min – 20 min"])
    expect(
      labelFilterValue(
        definitions.submitted,
        {preset: "last7Days"},
        getOptionLabel,
      ),
    ).toEqual(["Last 7 days"])
    expect(
      labelFilterValue(
        definitions.submitted,
        {range: [null, "2026-11-09"]},
        getOptionLabel,
      ),
    ).toEqual(["≤ 2026-11-09"])
    expect(labelFilterValue(definitions.query, "out/", getOptionLabel)).toEqual(
      ["out/"],
    )
    expect(
      labelFilterValue(
        definitions.tags,
        {all: true, tags: ["x", "y"]},
        getOptionLabel,
      ),
    ).toEqual(["x", "y"])
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
