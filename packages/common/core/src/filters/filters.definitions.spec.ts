import {describe, expect, expectTypeOf, test} from "vitest"

import {ListCollection} from "@qualcomm-ui/utils/collection"

import {
  customFilter,
  type DateFilterValue,
  dateFilter,
  defineFilters,
  type FilterValues,
  listFilter,
  rangeFilter,
  type RangeFilterValue,
  textFilter,
  treeFilter,
} from "./filters.definitions"

const statuses = new ListCollection({items: ["Failed", "Passed"]})

const buildFilters = defineFilters({
  buildPath: textFilter({label: "Build path"}),
  chipset: treeFilter(),
  duration: rangeFilter({max: 120, min: 0}),
  status: listFilter({collection: statuses}),
  submitted: dateFilter(),
  tags: customFilter<{tags: string[]}>(),
})

describe("filter definitions", () => {
  test("defineFilters stamps each definition with its key as the id", () => {
    expect(buildFilters.status).toEqual({
      collection: statuses,
      id: "status",
      kind: "list",
    })
    expect(buildFilters.duration.id).toBe("duration")
    expectTypeOf(buildFilters.status.id).toEqualTypeOf<string>()
    expectTypeOf(buildFilters.status.kind).toEqualTypeOf<"list">()
  })

  test("FilterValues maps every filter to an optional value of its type", () => {
    expectTypeOf<FilterValues<typeof buildFilters>>().toEqualTypeOf<{
      buildPath?: string
      chipset?: string[]
      duration?: RangeFilterValue
      status?: string[]
      submitted?: DateFilterValue
      tags?: {tags: string[]}
    }>()
  })

  test("presets need a range unless named after a date picker preset", () => {
    dateFilter({
      presets: [
        {label: "Last 7 days", value: "last7Days"},
        {
          label: "This fiscal year",
          range: () => ["2026-04-01", null],
          value: "fy",
        },
        // @ts-expect-error custom preset values need a range
        {label: "This fiscal year", value: "fy"},
      ],
    })
  })
})
