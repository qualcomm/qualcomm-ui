// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {mergeAllOf} from "./merge-all-of.js"

describe("mergeAllOf", () => {
  test("combines the properties and required lists of the parts", () => {
    expect(
      mergeAllOf({
        allOf: [
          {properties: {data: {type: "array"}}, type: "object"},
          {properties: {page: {type: "integer"}}, required: ["page"]},
        ],
      }),
    ).toEqual({
      properties: {data: {type: "array"}, page: {type: "integer"}},
      required: ["page"],
      type: "object",
    })
  })

  test("lets the schema's own keys win over its parts", () => {
    expect(
      mergeAllOf({
        allOf: [{description: "Base", properties: {id: {type: "string"}}}],
        description: "Own",
        properties: {id: {format: "uuid", type: "string"}},
      }),
    ).toEqual({
      description: "Own",
      properties: {id: {format: "uuid", type: "string"}},
    })
  })

  test("combines a property declared in several parts", () => {
    expect(
      mergeAllOf({
        allOf: [
          {properties: {id: {type: "integer"}}},
          {properties: {id: {description: "Custom ID"}}},
        ],
      }),
    ).toEqual({properties: {id: {description: "Custom ID", type: "integer"}}})
  })

  test("combines nested objects declared in several parts", () => {
    expect(
      mergeAllOf({
        allOf: [
          {
            properties: {
              meta: {properties: {id: {type: "integer"}}, required: ["id"]},
            },
          },
          {properties: {meta: {properties: {name: {type: "string"}}}}},
        ],
      }),
    ).toEqual({
      properties: {
        meta: {
          properties: {id: {type: "integer"}, name: {type: "string"}},
          required: ["id"],
        },
      },
    })
  })

  test("folds allOf inside properties declared in several parts", () => {
    const merged = mergeAllOf({
      allOf: [
        {properties: {meta: {allOf: [{properties: {id: {type: "integer"}}}]}}},
        {properties: {meta: {allOf: [{properties: {name: {type: "string"}}}]}}},
      ],
    })
    expect(merged.properties?.meta.properties).toEqual({
      id: {type: "integer"},
      name: {type: "string"},
    })
  })

  test("combines array items declared in several parts", () => {
    const merged = mergeAllOf({
      allOf: [
        {items: {properties: {id: {type: "integer"}}}, type: "array"},
        {items: {properties: {name: {type: "string"}}}},
      ],
    })
    expect(merged.items?.properties).toEqual({
      id: {type: "integer"},
      name: {type: "string"},
    })
  })

  test("merges nested allOf parts", () => {
    expect(
      mergeAllOf({
        allOf: [
          {allOf: [{properties: {a: {type: "string"}}, required: ["a"]}]},
          {properties: {b: {type: "string"}}, required: ["a", "b"]},
        ],
      }),
    ).toEqual({
      properties: {a: {type: "string"}, b: {type: "string"}},
      required: ["a", "b"],
    })
  })

  test("keeps its own title but not its parts'", () => {
    expect(mergeAllOf({allOf: [{title: "Paginated", type: "object"}]})).toEqual(
      {type: "object"},
    )
    expect(
      mergeAllOf({allOf: [{title: "Pet", type: "object"}], title: "Dog"}),
    ).toEqual({title: "Dog", type: "object"})
  })

  test("returns schemas without allOf unchanged", () => {
    const schema = {type: "string"}
    expect(mergeAllOf(schema)).toBe(schema)
  })
})
