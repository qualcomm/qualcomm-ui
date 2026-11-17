import {describe, expect, expectTypeOf, test} from "vitest"

import {
  checkboxFilter,
  customFilter,
  type DateFilterValue,
  dateFilter,
  defineFilters,
  type FilterValues,
  normalizeFilterOption,
  rangeFilter,
  type RangeFilterValue,
  textFilter,
} from "./filter-panel.definitions"

const buildFilters = defineFilters({
  buildPath: textFilter({label: "Build path"}),
  duration: rangeFilter({max: 120, min: 0}),
  status: checkboxFilter({options: ["Failed", "Passed"]}),
  submitted: dateFilter(),
  tags: customFilter<{tags: string[]}>(),
})

describe("filter definitions", () => {
  test("defineFilters stamps each definition with its key as the id", () => {
    expect(buildFilters.status).toEqual({
      id: "status",
      kind: "checkbox",
      options: ["Failed", "Passed"],
    })
    expect(buildFilters.duration.id).toBe("duration")
    expectTypeOf(buildFilters.status.id).toEqualTypeOf<"status">()
    expectTypeOf(buildFilters.status.kind).toEqualTypeOf<"checkbox">()
  })

  test("FilterValues maps every filter to an optional value of its type", () => {
    expectTypeOf<FilterValues<typeof buildFilters>>().toEqualTypeOf<{
      buildPath?: string
      duration?: RangeFilterValue
      status?: string[]
      submitted?: DateFilterValue
      tags?: {tags: string[]}
    }>()
  })

  test("normalizeFilterOption converts strings to option objects", () => {
    expect(normalizeFilterOption("Failed")).toEqual({
      label: "Failed",
      value: "Failed",
    })
    expect(normalizeFilterOption({label: "Failed", value: "f"})).toEqual({
      label: "Failed",
      value: "f",
    })
  })
})
