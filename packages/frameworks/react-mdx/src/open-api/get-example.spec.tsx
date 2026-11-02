// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {getExample} from "./get-example.js"

describe("getExample", () => {
  test("prefers the spec's example, then default, then the first enum value", () => {
    expect(getExample({example: "doggie", type: "string"})).toBe("doggie")
    expect(getExample({examples: [42], type: "integer"})).toBe(42)
    expect(getExample({default: "sold", enum: ["available"]})).toBe("sold")
    expect(getExample({enum: ["available", "sold"]})).toBe("available")
  })

  test("builds objects and arrays from their parts", () => {
    expect(
      getExample({
        properties: {
          id: {format: "int64", type: "integer"},
          tags: {items: {type: "string"}, type: "array"},
        },
        type: "object",
      }),
    ).toEqual({id: 0, tags: ["string"]})
  })

  test("uses placeholders by type and string format", () => {
    expect(getExample({format: "date-time", type: "string"})).toBe(
      "2024-01-01T00:00:00Z",
    )
    expect(getExample({type: "boolean"})).toBe(true)
    expect(getExample({type: ["string", "null"]})).toBe("string")
  })

  test("merges allOf and takes the first oneOf alternative", () => {
    expect(
      getExample({
        allOf: [
          {properties: {a: {type: "integer"}}},
          {properties: {b: {type: "boolean"}}},
        ],
      }),
    ).toEqual({a: 0, b: true})
    expect(getExample({oneOf: [{type: "integer"}, {type: "string"}]})).toBe(0)
  })

  test("stops at recursive schemas", () => {
    expect(
      getExample({
        properties: {parent: {$ref: "#/c/Category", circular: true}},
        type: "object",
      }),
    ).toEqual({parent: undefined})
  })
})
