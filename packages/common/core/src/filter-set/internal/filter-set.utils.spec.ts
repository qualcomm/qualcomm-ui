import {describe, expect, test} from "vitest"

import {
  customFilter,
  dateFilter,
  defineFilters,
  listFilter,
  rangeFilter,
  textFilter,
} from "@qualcomm-ui/core/filters"

import {
  areValuesEqual,
  countValues,
  createEmptyValueCheck,
  hashValues,
  setFilterValue,
} from "./filter-set.utils"

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

const isEmpty = createEmptyValueCheck(definitions, undefined)

describe("filter set utils", () => {
  test("blank values are empty for every filter", () => {
    for (const value of [undefined, null, "", []]) {
      expect(isEmpty("status", value)).toBe(true)
      expect(isEmpty("unknown", value)).toBe(true)
    }
    expect(isEmpty("status", ["Failed"])).toBe(false)
  })

  test("definitions decide whether other values are empty", () => {
    expect(isEmpty("duration", [null, null])).toBe(true)
    expect(isEmpty("duration", [10, null])).toBe(false)
    expect(isEmpty("submitted", {preset: "last7Days"})).toBe(false)
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
        submitted: {preset: "last7Days"},
        tags: {all: false, tags: ["a", "b", "c"]},
        unknown: ["x"],
      }),
    ).toBe(9)
    expect(
      countValues(definitions, isEmpty, {duration: [null, null], status: []}),
    ).toBe(0)
  })
})
