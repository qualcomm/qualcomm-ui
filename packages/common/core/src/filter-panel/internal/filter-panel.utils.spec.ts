import {describe, expect, test} from "vitest"

import {
  checkboxFilter,
  customFilter,
  dateFilter,
  defineFilters,
  rangeFilter,
  textFilter,
} from "../filter-panel.definitions"

import {
  areValuesEqual,
  countValues,
  createEmptyValueCheck,
  getValueLabels,
  hashValues,
  pickOptionLabels,
  recordOptionLabels,
  setFilterValue,
  stringifyFilterValue,
} from "./filter-panel.utils"

const definitions = defineFilters({
  duration: rangeFilter({formatValue: (value) => `${value} min`}),
  query: textFilter(),
  status: checkboxFilter(),
  submitted: dateFilter({
    presets: [{label: "Last 7 days", range: () => [null, null], value: "7d"}],
  }),
  tags: customFilter<{all: boolean; tags: string[]}>({
    getValueCount: (value) => value.tags.length,
    getValueLabels: (value) => value.tags,
    isEmptyValue: (value) => value.tags.length === 0,
  }),
})

const isEmpty = createEmptyValueCheck(definitions, undefined)

describe("filter panel utils", () => {
  test("blank values are empty for every filter", () => {
    for (const value of [undefined, null, "", []]) {
      expect(isEmpty("status", value)).toBe(true)
      expect(isEmpty("unknown", value)).toBe(true)
    }
    expect(isEmpty("status", ["Failed"])).toBe(false)
  })

  test("unbounded ranges and dates are empty", () => {
    expect(isEmpty("duration", [null, null])).toBe(true)
    expect(isEmpty("duration", [10, null])).toBe(false)
    expect(isEmpty("submitted", {range: [null, null]})).toBe(true)
    expect(isEmpty("submitted", {range: ["2026-11-01", null]})).toBe(false)
    expect(isEmpty("submitted", {preset: ""})).toBe(true)
    expect(isEmpty("submitted", {preset: "7d"})).toBe(false)
  })

  test("custom definitions and the consumer check can reject values", () => {
    expect(isEmpty("tags", {all: true, tags: []})).toBe(true)

    const isEmptyWithConsumer = createEmptyValueCheck(
      definitions,
      (id, value) => id === "query" && value === "*",
    )
    expect(isEmptyWithConsumer("query", "*")).toBe(true)
    expect(isEmptyWithConsumer("query", "out/")).toBe(false)
  })

  test("setFilterValue adds, replaces, and deletes keys", () => {
    const added = setFilterValue(isEmpty, {}, "status", ["Failed"])
    expect(added).toEqual({status: ["Failed"]})

    const replaced = setFilterValue(isEmpty, added, "status", ["Queued"])
    expect(replaced).toEqual({status: ["Queued"]})

    expect(setFilterValue(isEmpty, replaced, "status", [])).toStrictEqual({})
    expect(
      setFilterValue(isEmpty, {duration: [10, 20]}, "duration", [null, null]),
    ).toStrictEqual({})
  })

  test("setFilterValue applies functional updaters to the current value", () => {
    expect(
      setFilterValue(
        isEmpty,
        {status: ["Failed"]},
        "status",
        (prev: unknown) => [...(prev as string[]), "Queued"],
      ),
    ).toEqual({status: ["Failed", "Queued"]})
  })

  test("areValuesEqual ignores key order and empty values", () => {
    expect(
      areValuesEqual(
        isEmpty,
        {duration: [10, 20], status: ["Failed"]},
        {duration: [10, 20], query: "", status: ["Failed"]},
      ),
    ).toBe(true)
    expect(
      areValuesEqual(isEmpty, {status: ["Failed"]}, {status: ["Queued"]}),
    ).toBe(false)
    expect(areValuesEqual(isEmpty, {status: ["Failed"]}, {})).toBe(false)
  })

  test("hashValues is independent of key order", () => {
    expect(hashValues({a: 1, b: [2]})).toBe(hashValues({a: 1, b: [2]}))
    expect(hashValues({a: 1, b: [2]})).toBe(hashValues({a: 1, b: [2]}))
    expect(hashValues({a: 1})).not.toBe(hashValues({a: 2}))
  })

  test("countValues counts array items and one per other value", () => {
    expect(countValues(definitions, isEmpty, {})).toBe(0)
    expect(
      countValues(definitions, isEmpty, {
        duration: [10, null],
        query: "out/",
        status: ["Failed", "Queued"],
        submitted: {preset: "7d"},
        tags: {all: false, tags: ["a", "b", "c"]},
        unknown: ["x"],
      }),
    ).toBe(9)
    expect(
      countValues(definitions, isEmpty, {duration: [null, null], status: []}),
    ).toBe(0)
  })

  test("getValueLabels summarizes each kind of value", () => {
    const getOptionLabel = (option: string) => option.toUpperCase()

    expect(
      getValueLabels(definitions.status, ["a", "b"], getOptionLabel),
    ).toEqual(["A", "B"])
    expect(
      getValueLabels(definitions.duration, [10, null], getOptionLabel),
    ).toEqual(["≥ 10 min"])
    expect(
      getValueLabels(definitions.duration, [10, 20], getOptionLabel),
    ).toEqual(["10 min – 20 min"])
    expect(
      getValueLabels(definitions.submitted, {preset: "7d"}, getOptionLabel),
    ).toEqual(["Last 7 days"])
    expect(
      getValueLabels(
        definitions.submitted,
        {range: [null, "2026-11-09"]},
        getOptionLabel,
      ),
    ).toEqual(["≤ 2026-11-09"])
    expect(getValueLabels(definitions.query, "out/", getOptionLabel)).toEqual([
      "out/",
    ])
    expect(
      getValueLabels(
        definitions.tags,
        {all: true, tags: ["x", "y"]},
        getOptionLabel,
      ),
    ).toEqual(["x", "y"])
  })

  test("recorded labels merge, and only selected values are picked", () => {
    const recorded = recordOptionLabels(
      recordOptionLabels({}, "user", {u1: "Anna Robinson"}),
      "user",
      {u2: "Ben Ortiz"},
    )
    expect(recorded).toEqual({user: {u1: "Anna Robinson", u2: "Ben Ortiz"}})
    expect(recordOptionLabels(recorded, "user", {})).toBe(recorded)

    expect(pickOptionLabels(recorded, {query: "x", user: ["u2"]})).toEqual({
      user: {u2: "Ben Ortiz"},
    })
    expect(pickOptionLabels(recorded, {})).toEqual({})
  })

  test("stringifyFilterValue stringifies primitives only", () => {
    expect(stringifyFilterValue("single")).toBe("single")
    expect(stringifyFilterValue(12)).toBe("12")
    expect(stringifyFilterValue(false)).toBe("false")
    expect(stringifyFilterValue(null)).toBe("")
    expect(stringifyFilterValue({preset: "7d"})).toBe("")
  })
})
