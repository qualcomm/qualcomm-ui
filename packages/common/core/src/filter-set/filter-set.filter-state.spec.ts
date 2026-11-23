import {afterEach, describe, expect, test, vi} from "vitest"

import {
  dateFilter,
  defineFilters,
  type FilterDefinitions,
  listFilter,
} from "@qualcomm-ui/core/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"

import {createFilterState} from "./filter-set.filter-state.js"
import type {FilterSetApi} from "./filter-set.types.js"

const statuses = new ListCollection({items: ["Failed", "Passed"]})

const filters = defineFilters({
  status: listFilter({collection: statuses, label: "Status"}),
  submitted: dateFilter({label: "Submitted"}),
})

function createFilterSet(
  draftValue: Record<string, unknown> = {},
  definitions: FilterDefinitions = filters,
) {
  return {
    filters: definitions,
    getDraftValue: (id: string) => draftValue[id],
    getDraftValueCount: (id: string) =>
      Array.isArray(draftValue[id]) ? (draftValue[id] as unknown[]).length : 0,
    getFilterCollection: (id: string) =>
      id === "status" ? statuses : undefined,
    getFilterLabel: (id: string) => definitions[id]?.label ?? id,
    getFilterOptionCounts: (id: string) =>
      id === "status" ? {Failed: 1} : undefined,
    hasDraftValue: (id: string) => draftValue[id] !== undefined,
    setDraftValue: vi.fn(),
  } as unknown as FilterSetApi<any>
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe("createFilterState", () => {
  test("reads the filter's draft state", () => {
    const state = createFilterState(
      createFilterSet({status: ["Failed"]}),
      filters.status,
      {labelId: "label-1"},
    )

    expect(state).toMatchObject({
      collection: statuses,
      count: 1,
      definition: filters.status,
      id: "status",
      isActive: true,
      label: "Status",
      labelId: "label-1",
      optionCounts: {Failed: 1},
      value: ["Failed"],
    })
  })

  test("only collection filters have a collection", () => {
    const state = createFilterState(createFilterSet(), filters.submitted)
    expect(state?.collection).toBeUndefined()
    expect(state?.labelId).toBeUndefined()
  })

  test("writes and clears the draft value", () => {
    const filterSet = createFilterSet()
    const state = createFilterState(filterSet, filters.status)

    state?.setValue(["Passed"])
    expect(filterSet.setDraftValue).toHaveBeenLastCalledWith("status", [
      "Passed",
    ])

    state?.clear()
    expect(filterSet.setDraftValue).toHaveBeenLastCalledWith(
      "status",
      undefined,
    )
  })

  test("warns about a filter that isn't in the filter set", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const other = defineFilters({region: listFilter({label: "Region"})})

    expect(createFilterState(createFilterSet(), other.region)).toBeDefined()
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining(
        `Filter "region" isn't in the filter set's filters`,
      ),
    )
  })

  test("returns nothing and warns when the definition is missing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    expect(createFilterState(createFilterSet(), undefined)).toBeUndefined()
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("FilterProvider received no filter definition"),
    )
  })
})
