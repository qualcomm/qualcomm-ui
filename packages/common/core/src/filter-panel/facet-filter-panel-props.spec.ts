import {describe, expect, test, vi} from "vitest"

import {FacetFilter} from "@qualcomm-ui/utils/facet-filter"

import {getFacetFilterPanelProps} from "./facet-filter-panel-props.js"

const items = [
  {id: "1", name: "Alpha", os: ["Linux"], tech: ["AI"]},
  {id: "2", name: "Beta", os: ["Windows"], tech: ["AI"]},
  {id: "3", name: "Gamma", os: ["Linux"], tech: ["Connectivity"]},
]

function createFacetFilter() {
  return new FacetFilter(items, {fields: {os: {}, tech: {}}})
}

describe("getFacetFilterPanelProps", () => {
  test("options are the field's values", () => {
    const {getFilterOptions} = getFacetFilterPanelProps(createFacetFilter())

    expect(getFilterOptions("os")).toEqual([
      {label: "Linux", value: "Linux"},
      {label: "Windows", value: "Windows"},
    ])
    expect(getFilterOptions("unknown")).toBeUndefined()
  })

  test("counts reflect the selections in other fields", () => {
    const {getFilterOptionCounts} =
      getFacetFilterPanelProps(createFacetFilter())
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
    const {getFilterOptionCounts} =
      getFacetFilterPanelProps(createFacetFilter())

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
    const {getFilterOptionCounts} = getFacetFilterPanelProps(
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
