import {describe, expect, test, vi} from "vitest"

import {FacetIndex} from "@qualcomm-ui/utils/facet-index"

import {getFacetFilterSetProps} from "./filter-set.facets.js"

const items = [
  {id: "1", name: "Alpha", os: ["Linux"], tech: ["AI"]},
  {id: "2", name: "Beta", os: ["Windows"], tech: ["AI"]},
  {id: "3", name: "Gamma", os: ["Linux"], tech: ["Connectivity"]},
]

function createFacetIndex() {
  return new FacetIndex(items, {fields: {os: {}, tech: {}}})
}

describe("getFacetFilterSetProps", () => {
  test("collections hold the field's values", () => {
    const {getFilterCollection} = getFacetFilterSetProps(createFacetIndex())
    const collection = getFilterCollection("os")

    expect(collection?.items).toEqual([
      {label: "Linux", value: "Linux"},
      {label: "Windows", value: "Windows"},
    ])
    expect(getFilterCollection("os")).toBe(collection)
    expect(getFilterCollection("unknown")).toBeUndefined()
  })

  test("counts reflect the selections in other fields", () => {
    const {getFilterOptionCounts} = getFacetFilterSetProps(createFacetIndex())
    const values = {os: ["Linux"]}

    expect(getFilterOptionCounts("os", values)).toEqual({Linux: 2, Windows: 1})
    expect(getFilterOptionCounts("tech", values)).toEqual({
      AI: 1,
      Connectivity: 1,
    })
    expect(getFilterOptionCounts("unknown", values)).toBeUndefined()
  })

  test("values that are not facet selections do not filter", () => {
    const {getFilterOptionCounts} = getFacetFilterSetProps(createFacetIndex())

    expect(
      getFilterOptionCounts("os", {name: "Alpha", visits: [1, null]}),
    ).toEqual({Linux: 2, Windows: 1})
  })

  test("getCandidateIds limits the counted items", () => {
    const getCandidateIds = vi.fn((values: Record<string, unknown>) =>
      typeof values.name === "string"
        ? items
            .filter((item) => item.name.startsWith(values.name as string))
            .map((item) => item.id)
        : undefined,
    )
    const {getFilterOptionCounts} = getFacetFilterSetProps(createFacetIndex(), {
      getCandidateIds,
    })
    const values = {name: "Al"}

    expect(getFilterOptionCounts("os", values)).toEqual({Linux: 1, Windows: 0})
    getFilterOptionCounts("tech", {name: "Al"})

    expect(getCandidateIds).toHaveBeenCalledTimes(1)
  })
})
