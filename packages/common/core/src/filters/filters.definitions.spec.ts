import {describe, expect, expectTypeOf, test} from "vitest"

import {ListCollection, TreeCollection} from "@qualcomm-ui/utils/collection"

import {
  type CollectionFilterId,
  customFilter,
  type DateFilterValue,
  dateFilter,
  defineFilters,
  type FilterCollection,
  type FilterDefinitions,
  type FilterIdOfKind,
  type FilterOptionObject,
  type FilterValues,
  listFilter,
  rangeFilter,
  type RangeFilterValue,
  textFilter,
  treeFilter,
  type UnresolvedCollectionFilterId,
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
    expectTypeOf(buildFilters.status.id).toEqualTypeOf<"status">()
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

  test("collections hold the definition's item type", () => {
    interface ChipNode {
      nodes?: ChipNode[]
      value: string
    }
    interface Owner {
      id: string
      name: string
    }
    const filters = defineFilters({
      chipset: treeFilter({
        collection: new TreeCollection<ChipNode>({rootNode: {value: "root"}}),
      }),
      owner: listFilter<Owner>(),
      platform: listFilter(),
      status: listFilter({collection: statuses}),
    })

    expect(filters.platform.collection).toBeUndefined()
    expectTypeOf<FilterCollection<typeof filters.status>>().toEqualTypeOf<
      ListCollection<string>
    >()
    expectTypeOf<FilterCollection<typeof filters.platform>>().toEqualTypeOf<
      ListCollection<FilterOptionObject>
    >()
    expectTypeOf<FilterCollection<typeof filters.owner>>().toEqualTypeOf<
      ListCollection<Owner>
    >()
    expectTypeOf<FilterCollection<typeof filters.chipset>>().toEqualTypeOf<
      TreeCollection<ChipNode>
    >()
    expectTypeOf<UnresolvedCollectionFilterId<typeof filters>>().toEqualTypeOf<
      "owner" | "platform"
    >()
  })

  test("filter ids can be narrowed by kind", () => {
    expectTypeOf<CollectionFilterId<typeof buildFilters>>().toEqualTypeOf<
      "chipset" | "status"
    >()
    expectTypeOf<
      FilterIdOfKind<typeof buildFilters, "range">
    >().toEqualTypeOf<"duration">()
    expectTypeOf<
      UnresolvedCollectionFilterId<typeof buildFilters>
    >().toEqualTypeOf<"chipset">()
    expectTypeOf<
      CollectionFilterId<FilterDefinitions>
    >().toEqualTypeOf<string>()
    expectTypeOf<
      UnresolvedCollectionFilterId<FilterDefinitions>
    >().toEqualTypeOf<string>()
  })
})
