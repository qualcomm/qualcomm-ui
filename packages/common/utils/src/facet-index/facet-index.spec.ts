import {describe, expect, test} from "vitest"

import {
  FacetIndex,
  type FacetIndexConfig,
  type FacetIndexInput,
  type FacetIndexItem,
  type FacetIndexResult,
  type FacetSelections,
} from "./facet-index.js"

const items = [
  {id: "1", operatingSystems: ["Linux"], technologies: ["AI"]},
  {id: "2", operatingSystems: ["Windows"], technologies: ["AI"]},
  {id: "3", operatingSystems: ["Linux"], technologies: ["Connectivity"]},
]

const config: FacetIndexConfig = {
  fields: {
    operatingSystems: {},
    technologies: {},
  },
}

const tagged = [
  {id: "1", tags: ["a", "b"]},
  {id: "2", tags: ["a"]},
  {id: "3", tags: ["b", "c"]},
  {id: "4", tags: ["a", "b", "c"]},
]

describe("FacetIndex", () => {
  test("matches any value within a field and all fields together", () => {
    const result = new FacetIndex(items, config).filter({
      selections: {
        operatingSystems: ["Linux", "Windows"],
        technologies: ["Connectivity"],
      },
    })

    expect(result.ids).toEqual(["3"])
  })

  test("returns every item and full counts without input", () => {
    const result = new FacetIndex(items, config).filter()

    expect(result).toEqual({
      facets: {
        operatingSystems: [
          {docCount: 2, key: "Linux", selected: false},
          {docCount: 1, key: "Windows", selected: false},
        ],
        technologies: [
          {docCount: 2, key: "AI", selected: false},
          {docCount: 1, key: "Connectivity", selected: false},
        ],
      },
      ids: ["1", "2", "3"],
    })
  })

  test("does not filter on fields with empty selections", () => {
    const result = new FacetIndex(items, config).filter({
      selections: {operatingSystems: [], unknown: []},
    })

    expect(result.ids).toEqual(["1", "2", "3"])
  })

  test("returns empty results for an empty item set", () => {
    const result = new FacetIndex([], config).filter({
      selections: {operatingSystems: ["Linux"]},
    })

    expect(result).toEqual({
      facets: {operatingSystems: [], technologies: []},
      ids: [],
    })
  })

  test("limits results and buckets to the supplied candidate ids", () => {
    const result = new FacetIndex(items, config).filter({ids: ["1", "3"]})

    expect(result.ids).toEqual(["1", "3"])
    expect(result.facets.operatingSystems).toEqual([
      {docCount: 2, key: "Linux", selected: false},
      {docCount: 0, key: "Windows", selected: false},
    ])
  })

  test("returns candidates in the supplied order and skips unknown ids", () => {
    const result = new FacetIndex(items, config).filter({
      ids: ["3", "missing", "1"],
    })

    expect(result.ids).toEqual(["3", "1"])
  })

  test("counts a repeated candidate id once", () => {
    const result = new FacetIndex(items, config).filter({
      ids: ["1", "1", "2"],
    })

    expect(result.ids).toEqual(["1", "2"])
    expect(result.facets.technologies).toEqual([
      {docCount: 2, key: "AI", selected: false},
      {docCount: 0, key: "Connectivity", selected: false},
    ])
  })

  test("applies selections within the supplied candidate ids", () => {
    const result = new FacetIndex(items, config).filter({
      ids: ["2", "3"],
      selections: {technologies: ["AI"]},
    })

    expect(result.ids).toEqual(["2"])
    expect(result.facets.operatingSystems).toEqual([
      {docCount: 0, key: "Linux", selected: false},
      {docCount: 1, key: "Windows", selected: false},
    ])
    expect(result.facets.technologies).toEqual([
      {docCount: 1, key: "AI", selected: true},
      {docCount: 1, key: "Connectivity", selected: false},
    ])
  })

  test("counts each match-any bucket without the field's own selections", () => {
    const result = new FacetIndex(items, config).filter({
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

  test("matches nothing for a match-any value missing from the data", () => {
    const result = new FacetIndex(items, config).filter({
      selections: {operatingSystems: ["macOS"]},
    })

    expect(result.ids).toEqual([])
    expect(result.facets.operatingSystems).toEqual([
      {docCount: 2, key: "Linux", selected: false},
      {docCount: 1, key: "Windows", selected: false},
    ])
    expect(result.facets.technologies).toEqual([
      {docCount: 0, key: "AI", selected: false},
      {docCount: 0, key: "Connectivity", selected: false},
    ])
  })

  test("requires every selected value for match-all fields", () => {
    const result = new FacetIndex(tagged, {
      fields: {tags: {match: "all"}},
    }).filter({selections: {tags: ["a"]}})

    expect(result.ids).toEqual(["1", "2", "4"])
    expect(result.facets.tags).toEqual([
      {docCount: 3, key: "a", selected: true},
      {docCount: 2, key: "b", selected: false},
      {docCount: 1, key: "c", selected: false},
    ])
  })

  test("counts match-all buckets on top of several selected values", () => {
    const result = new FacetIndex(tagged, {
      fields: {tags: {match: "all"}},
    }).filter({selections: {tags: ["b", "a"]}})

    expect(result.ids).toEqual(["1", "4"])
    expect(result.facets.tags).toEqual([
      {docCount: 2, key: "a", selected: true},
      {docCount: 2, key: "b", selected: true},
      {docCount: 1, key: "c", selected: false},
    ])
  })

  test("matches nothing for a match-all value missing from the data", () => {
    const result = new FacetIndex(tagged, {
      fields: {tags: {match: "all"}},
    }).filter({selections: {tags: ["a", "z"]}})

    expect(result.ids).toEqual([])
    expect(result.facets.tags).toEqual([
      {docCount: 0, key: "a", selected: true},
      {docCount: 0, key: "b", selected: false},
      {docCount: 0, key: "c", selected: false},
    ])
  })

  test("counts buckets across match-any and match-all fields", () => {
    const mixed = [
      {id: "1", os: ["Linux"], tags: ["a", "b"]},
      {id: "2", os: ["Windows"], tags: ["a", "b"]},
      {id: "3", os: ["Linux"], tags: ["a"]},
      {id: "4", os: ["macOS"], tags: ["b"]},
    ]
    const result = new FacetIndex(mixed, {
      fields: {os: {}, tags: {match: "all"}},
    }).filter({selections: {os: ["Linux", "macOS"], tags: ["b"]}})

    expect(result.ids).toEqual(["1", "4"])
    expect(result.facets.os).toEqual([
      {docCount: 1, key: "Linux", selected: true},
      {docCount: 1, key: "macOS", selected: true},
      {docCount: 1, key: "Windows", selected: false},
    ])
    expect(result.facets.tags).toEqual([
      {docCount: 1, key: "a", selected: false},
      {docCount: 2, key: "b", selected: true},
    ])
  })

  test("reads values from a nested path", () => {
    const nested = [
      {id: "1", meta: {platforms: [{name: "x"}, {name: "y"}]}},
      {id: "2", meta: {platforms: [{name: "y"}]}},
    ]
    const result = new FacetIndex(nested, {
      fields: {platform: {path: "meta.platforms.name"}},
    }).filter({selections: {platform: ["x"]}})

    expect(result.ids).toEqual(["1"])
    expect(result.facets.platform).toEqual([
      {docCount: 1, key: "x", selected: true},
      {docCount: 2, key: "y", selected: false},
    ])
  })

  test("flattens arrays at every level of a nested path", () => {
    const nested = [
      {id: "1", variants: [{chips: ["a", "b"]}, {chips: ["c"]}]},
      {id: "2", variants: [{chips: "d"}]},
    ]
    const facetIndex = new FacetIndex(nested, {
      fields: {chip: {path: "variants.chips"}},
    })

    expect(facetIndex.getValues("chip")).toEqual(["a", "b", "c", "d"])
    expect(facetIndex.filter({selections: {chip: ["c"]}}).ids).toEqual(["1"])
  })

  test("skips paths that are missing or pass through non-objects", () => {
    const sparse = [
      {id: "1", meta: {os: "Linux"}},
      {id: "2"},
      {id: "3", meta: null},
      {id: "4", meta: "Linux"},
      {id: "5", meta: [null, {os: "Windows"}]},
    ]
    const result = new FacetIndex(sparse, {
      fields: {os: {path: "meta.os"}},
    }).filter()

    expect(result.facets.os).toEqual([
      {docCount: 1, key: "Linux", selected: false},
      {docCount: 1, key: "Windows", selected: false},
    ])
  })

  test("ignores values that are not strings", () => {
    const mixed = [
      {id: "1", tags: ["a", 1, true, null, undefined, {}, ["b"]]},
      {id: "2", tags: 2},
    ]
    const result = new FacetIndex(mixed, {fields: {tags: {}}}).filter()

    expect(result.facets.tags).toEqual([
      {docCount: 1, key: "a", selected: false},
    ])
  })

  test("counts an item once when it repeats a value", () => {
    const repeated = [{id: "1", tags: ["a", "a"]}]
    const result = new FacetIndex(repeated, {fields: {tags: {}}}).filter()

    expect(result.facets.tags).toEqual([
      {docCount: 1, key: "a", selected: false},
    ])
  })

  test("excludes all items when selecting an unconfigured field", () => {
    const result = new FacetIndex(items, config).filter({
      selections: {unknown: ["value"]},
    })

    expect(result.ids).toEqual([])
    expect(result.facets.operatingSystems).toEqual([
      {docCount: 0, key: "Linux", selected: false},
      {docCount: 0, key: "Windows", selected: false},
    ])
  })

  test("treats inherited object property names as unconfigured fields", () => {
    const result = new FacetIndex(items, config).filter({
      selections: {constructor: ["value"], toString: ["value"]},
    })

    expect(result.ids).toEqual([])
  })

  test("exposes the configured fields and their sorted values", () => {
    const facetIndex = new FacetIndex(items, config)

    expect(facetIndex.fields).toEqual(["operatingSystems", "technologies"])
    expect(facetIndex.getValues("technologies")).toEqual(["AI", "Connectivity"])
    expect(facetIndex.getValues("unknown")).toEqual([])
    expect(facetIndex.getValues("constructor")).toEqual([])
  })

  test("sorts values with locale-aware ordering", () => {
    const cased = [{id: "1", tags: ["b", "B", "a", "A"]}]

    expect(
      new FacetIndex(cased, {fields: {tags: {}}}).getValues("tags"),
    ).toEqual(["a", "A", "b", "B"])
  })

  test("returns the same values array on every call", () => {
    const facetIndex = new FacetIndex(items, config)

    expect(facetIndex.getValues("technologies")).toBe(
      facetIndex.getValues("technologies"),
    )
  })

  test("ignores mutations to the items and config after construction", () => {
    const sourceItems = items.map((item) => ({...item}))
    const sourceConfig: FacetIndexConfig = {fields: {operatingSystems: {}}}
    const facetIndex = new FacetIndex(sourceItems, sourceConfig)

    sourceItems.push({
      id: "4",
      operatingSystems: ["macOS"],
      technologies: ["AI"],
    })
    sourceConfig.fields.operatingSystems.match = "all"
    sourceConfig.fields.technologies = {}

    expect(facetIndex.fields).toEqual(["operatingSystems"])
    expect(
      facetIndex.filter({selections: {operatingSystems: ["Linux", "Windows"]}})
        .ids,
    ).toEqual(["1", "2", "3"])
  })
})

/**
 * Brute-force implementation of the documented semantics. Every bucket re-runs
 * the full match against every candidate, so it is only suitable as a test
 * oracle.
 */
function referenceFilter(
  source: readonly FacetIndexItem[],
  filterConfig: FacetIndexConfig,
  input: FacetIndexInput,
): FacetIndexResult {
  const fields = Object.entries(filterConfig.fields).map(([name, field]) => ({
    match: field.match ?? "any",
    name,
    path: field.path ?? name,
  }))

  function read(item: FacetIndexItem, path: string): string[] {
    let values: unknown[] = [item]
    for (const key of path.split(".")) {
      values = values.flatMap((value) => {
        if (typeof value !== "object" || value === null) {
          return []
        }
        const nested = (value as Record<string, unknown>)[key]
        return Array.isArray(nested) ? nested : [nested]
      })
    }
    return values.filter((value): value is string => typeof value === "string")
  }

  function matches(item: FacetIndexItem, selections: FacetSelections) {
    return Object.entries(selections).every(([name, selected]) => {
      if (selected.length === 0) {
        return true
      }
      const field = fields.find((entry) => entry.name === name)
      if (!field) {
        return false
      }
      const values = read(item, field.path)
      return field.match === "all"
        ? selected.every((value) => values.includes(value))
        : selected.some((value) => values.includes(value))
    })
  }

  const selections = input.selections ?? {}
  const candidates = input.ids
    ? [...new Set(input.ids)].flatMap((id) =>
        source.filter((item) => item.id === id),
      )
    : source

  return {
    facets: Object.fromEntries(
      fields.map((field) => {
        const values = [
          ...new Set(source.flatMap((item) => read(item, field.path))),
        ].sort((a, b) => a.localeCompare(b))
        const selected = selections[field.name] ?? []
        return [
          field.name,
          values.map((value) => ({
            docCount: candidates.filter((item) =>
              matches(item, {
                ...selections,
                [field.name]:
                  field.match === "all" ? [...selected, value] : [value],
              }),
            ).length,
            key: value,
            selected: selected.includes(value),
          })),
        ]
      }),
    ),
    ids: candidates
      .filter((item) => matches(item, selections))
      .map((item) => item.id),
  }
}

/**
 * Deterministic PRNG so that a failing case reproduces from its seed.
 */
function createRandom(seed: number) {
  let state = seed
  const next = () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const int = (max: number) => Math.floor(next() * max)
  const pick = <T>(values: readonly T[]): T => values[int(values.length)]
  const sample = <T>(values: readonly T[], max: number): T[] =>
    Array.from({length: int(max + 1)}, () => pick(values))
  return {int, next, pick, sample}
}

const randomConfig: FacetIndexConfig = {
  fields: {
    chip: {path: "variants.chip"},
    os: {},
    status: {},
    tags: {match: "all"},
    vendor: {match: "all", path: "meta.vendors.name"},
  },
}

const pools: Record<string, string[]> = {
  chip: ["c1", "c2", "c3", "c4"],
  os: ["Linux", "Windows", "macOS", "Android"],
  status: ["active", "deprecated", "draft"],
  tags: ["a", "b", "c", "d", "e"],
  vendor: ["v1", "v2", "v3"],
}

function createRandomCase(seed: number) {
  const random = createRandom(seed)
  const source: FacetIndexItem[] = Array.from(
    {length: random.int(40)},
    (_, index) => ({
      id: `item-${index}`,
      meta:
        random.next() < 0.2
          ? null
          : {
              vendors: random
                .sample(pools.vendor, 3)
                .map((name) => (random.next() < 0.1 ? {name: 7} : {name})),
            },
      os: random.sample([...pools.os, 42, null], 3),
      status: random.next() < 0.1 ? undefined : random.pick(pools.status),
      tags: random.sample(pools.tags, 4),
      variants: random
        .sample(pools.chip, 2)
        .map((chip) => ({chip: random.next() < 0.5 ? chip : [chip]})),
    }),
  )

  const selections: FacetSelections = {}
  for (const name of [...Object.keys(randomConfig.fields), "unknown"]) {
    const roll = random.next()
    if (roll < 0.5 || (name === "unknown" && roll < 0.95)) {
      continue
    }
    selections[name] = random.sample(
      [...(pools[name] ?? []), "missing-value"],
      3,
    )
  }

  const ids =
    random.next() < 0.5
      ? undefined
      : random.sample([...source.map((item) => item.id), "missing-id"], 30)

  return {input: {ids, selections}, source}
}

describe("FacetIndex matches the reference implementation", () => {
  test.each(Array.from({length: 300}, (_, seed) => seed))("seed %i", (seed) => {
    const {input, source} = createRandomCase(seed)

    expect(new FacetIndex(source, randomConfig).filter(input)).toEqual(
      referenceFilter(source, randomConfig, input),
    )
  })
})
