import {describe, expect, test} from "vitest"

import {FacetFilter, type FacetFilterConfig} from "./facet-filter.js"

const items = [
  {id: "1", operatingSystems: ["Linux"], technologies: ["AI"]},
  {id: "2", operatingSystems: ["Windows"], technologies: ["AI"]},
  {id: "3", operatingSystems: ["Linux"], technologies: ["Connectivity"]},
]

const config: FacetFilterConfig = {
  fields: {
    operatingSystems: {},
    technologies: {},
  },
}

describe("FacetFilter", () => {
  test("matches any value within a field and all fields together", () => {
    const result = new FacetFilter(items, config).filter({
      selections: {
        operatingSystems: ["Linux", "Windows"],
        technologies: ["Connectivity"],
      },
    })

    expect(result.ids).toEqual(["3"])
  })

  test("limits results and buckets to the supplied candidate ids", () => {
    const result = new FacetFilter(items, config).filter({ids: ["1", "3"]})

    expect(result.ids).toEqual(["1", "3"])
    expect(result.facets.operatingSystems).toEqual([
      {docCount: 2, key: "Linux", selected: false},
      {docCount: 0, key: "Windows", selected: false},
    ])
  })

  test("counts each match-any bucket without the field's own selections", () => {
    const result = new FacetFilter(items, config).filter({
      selections: {
        operatingSystems: ["Linux"],
        technologies: ["AI"],
      },
    })

    expect(result.facets.operatingSystems).toEqual([
      {docCount: 1, key: "Linux", selected: true},
      {docCount: 1, key: "Windows", selected: false},
    ])
    expect(result.facets.technologies).toEqual([
      {docCount: 1, key: "AI", selected: true},
      {docCount: 1, key: "Connectivity", selected: false},
    ])
  })

  test("requires every selected value for match-all fields", () => {
    const tagged = [
      {id: "1", tags: ["a", "b"]},
      {id: "2", tags: ["a"]},
      {id: "3", tags: ["b", "c"]},
    ]
    const result = new FacetFilter(tagged, {
      fields: {tags: {match: "all"}},
    }).filter({selections: {tags: ["a"]}})

    expect(result.ids).toEqual(["1", "2"])
    expect(result.facets.tags).toEqual([
      {docCount: 2, key: "a", selected: true},
      {docCount: 1, key: "b", selected: false},
      {docCount: 0, key: "c", selected: false},
    ])
  })

  test("reads values from a nested path", () => {
    const nested = [
      {id: "1", meta: {platforms: [{name: "x"}, {name: "y"}]}},
      {id: "2", meta: {platforms: [{name: "y"}]}},
    ]
    const result = new FacetFilter(nested, {
      fields: {platform: {path: "meta.platforms.name"}},
    }).filter({selections: {platform: ["x"]}})

    expect(result.ids).toEqual(["1"])
    expect(result.facets.platform).toEqual([
      {docCount: 1, key: "x", selected: true},
      {docCount: 2, key: "y", selected: false},
    ])
  })

  test("excludes all items when selecting an unconfigured field", () => {
    const result = new FacetFilter(items, config).filter({
      selections: {unknown: ["value"]},
    })

    expect(result.ids).toEqual([])
  })
})
