import {describe, expect, test, vi} from "vitest"

import type {ListCollection} from "@qualcomm-ui/utils/collection"
import {FacetFilter} from "@qualcomm-ui/utils/facet-filter"

import {getFacetFilterSetProps} from "./facet-filter-set-props.js"

const items = [
  {id: "1", name: "Alpha", os: ["Linux"], tech: ["AI"]},
  {id: "2", name: "Beta", os: ["Windows"], tech: ["AI"]},
  {id: "3", name: "Gamma", os: ["Linux"], tech: ["Connectivity"]},
]

function createFacetFilter() {
  return new FacetFilter(items, {fields: {os: {}, tech: {}}})
}

describe("getFacetFilterSetProps", () => {
  test("collections hold the field's values", () => {
    const {getFilterCollection} = getFacetFilterSetProps(createFacetFilter())
    const state = getFilterCollection("os", {values: []})

    expect(state?.status).toBe("success")
    expect((state?.collection as ListCollection<any>).items).toEqual([
      {label: "Linux", value: "Linux"},
      {label: "Windows", value: "Windows"},
    ])
    expect(getFilterCollection("os", {values: []})?.collection).toBe(
      state?.collection,
    )
    expect(getFilterCollection("unknown", {values: []})).toBeUndefined()
  })

  test("counts reflect the selections in other fields", () => {
    const {getFilterOptionCounts} = getFacetFilterSetProps(createFacetFilter())
    const values = {os: ["Linux"]}

    expect(getFilterOptionCounts("os", values)).toEqual(
      new Map([
        ["Linux", 2],
        ["Windows", 1],
      ]),
    )
    expect(getFilterOptionCounts("tech", values)).toEqual(
      new Map([
        ["AI", 1],
        ["Connectivity", 1],
      ]),
    )
    expect(getFilterOptionCounts("unknown", values)).toBeUndefined()
  })

  test("values that are not facet selections do not filter", () => {
    const {getFilterOptionCounts} = getFacetFilterSetProps(createFacetFilter())

    expect(
      getFilterOptionCounts("os", {name: "Alpha", visits: [1, null]}),
    ).toEqual(
      new Map([
        ["Linux", 2],
        ["Windows", 1],
      ]),
    )
  })

  test("getCandidateIds limits the counted items", () => {
    const getCandidateIds = vi.fn((values: Record<string, unknown>) =>
      typeof values.name === "string"
        ? items
            .filter((item) => item.name.startsWith(values.name as string))
            .map((item) => item.id)
        : undefined,
    )
    const {getFilterOptionCounts} = getFacetFilterSetProps(
      createFacetFilter(),
      {getCandidateIds},
    )
    const values = {name: "Al"}

    expect(getFilterOptionCounts("os", values)).toEqual(
      new Map([
        ["Linux", 1],
        ["Windows", 0],
      ]),
    )
    getFilterOptionCounts("tech", {name: "Al"})

    expect(getCandidateIds).toHaveBeenCalledTimes(1)
  })
})
