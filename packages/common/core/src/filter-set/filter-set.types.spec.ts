import {describe, expectTypeOf, test} from "vitest"

import {
  defineFilters,
  type FilterOptionObject,
  listFilter,
  rangeFilter,
  treeFilter,
} from "@qualcomm-ui/core/filters"
import {ListCollection, TreeCollection} from "@qualcomm-ui/utils/collection"
import {FacetIndex} from "@qualcomm-ui/utils/facet-index"

import {getFacetFilterSetProps} from "./filter-set.facets"
import type {FilterSetApi, FilterSetApiProps} from "./filter-set.types"

interface ChipNode {
  nodes?: ChipNode[]
  value: string
}

interface Owner {
  id: string
  name: string
}

const statuses = new ListCollection({items: ["Failed", "Passed"]})
const chipsets = new TreeCollection<ChipNode>({rootNode: {value: "root"}})

const filters = defineFilters({
  chipset: treeFilter({collection: chipsets}),
  duration: rangeFilter(),
  platform: listFilter(),
  status: listFilter({collection: statuses}),
})

const facetIndex = new FacetIndex([{id: "1", platform: "Linux"}], {
  fields: {platform: {}},
})

describe("FilterSetApi", () => {
  const api = {} as FilterSetApi<typeof filters>

  test("collections are typed by filter", () => {
    expectTypeOf(api.getFilterCollection<"status">).returns.toEqualTypeOf<
      ListCollection<string> | undefined
    >()
    expectTypeOf(api.getFilterCollection<"platform">).returns.toEqualTypeOf<
      ListCollection<FilterOptionObject> | undefined
    >()
    expectTypeOf(api.getFilterCollection<"chipset">).returns.toEqualTypeOf<
      TreeCollection<ChipNode> | undefined
    >()
  })

  test("definitions keep their type and reject unknown ids", () => {
    type Definitions = FilterSetApi<typeof filters>["filters"]
    expectTypeOf<Definitions["status"]>().toEqualTypeOf<
      (typeof filters)["status"]
    >()
    // @ts-expect-error filters has no "statsu" filter
    expectTypeOf<Definitions>().toHaveProperty("statsu")
  })

  test("filters are required", () => {
    // @ts-expect-error the filter set needs its definitions
    const props: FilterSetApiProps<typeof filters> = {}
    expectTypeOf(props.filters).toEqualTypeOf<typeof filters>()
  })

  test("kind-specific getters only accept filters of that kind", () => {
    // @ts-expect-error range filters have no collection
    expectTypeOf(api.getFilterCollection<"duration">)
    expectTypeOf(api.getFilterRange).parameter(0).toEqualTypeOf<"duration">()
  })
})

describe("getFilterCollection prop", () => {
  test("receives only the filters without their own collection", () => {
    expectTypeOf<
      NonNullable<FilterSetApiProps<typeof filters>["getFilterCollection"]>
    >()
      .parameter(0)
      .toEqualTypeOf<"platform">()
  })

  test("accepts facets when every list filter has its own collection", () => {
    const resolved = defineFilters({
      status: listFilter({collection: statuses}),
    })
    const props: FilterSetApiProps<typeof resolved> = {
      filters: resolved,
      ...getFacetFilterSetProps<typeof resolved>(facetIndex),
    }
    expectTypeOf(props).toEqualTypeOf<FilterSetApiProps<typeof resolved>>()
  })

  test("accepts facets for list filters with option object items", () => {
    const props: FilterSetApiProps<typeof filters> = {
      filters,
      ...getFacetFilterSetProps<typeof filters>(facetIndex),
    }
    expectTypeOf(props).toEqualTypeOf<FilterSetApiProps<typeof filters>>()
  })

  test("rejects facets for list filters with other items", () => {
    const owners = defineFilters({owner: listFilter<Owner>()})
    // @ts-expect-error facets can't produce Owner items
    const props: FilterSetApiProps<typeof owners> = {
      filters: owners,
      ...getFacetFilterSetProps<typeof owners>(facetIndex),
    }
    expectTypeOf(props).toEqualTypeOf<FilterSetApiProps<typeof owners>>()
  })
})
