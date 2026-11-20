// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {getVariantLabels, getVariants} from "./get-variants.js"
import {normalizeSchema} from "./normalize-schema.js"
import {getSchemaTypeLabel} from "./schema-type.js"

const planet = {properties: {name: {type: "string"}}, title: "Planet"}

describe("getVariants", () => {
  test("returns object alternatives, merged", () => {
    expect(
      getVariants({oneOf: [planet, {allOf: [{properties: {orbits: {}}}]}]}),
    ).toEqual([planet, {properties: {orbits: {}}}])
  })

  test("combines each alternative with the fields declared next to it", () => {
    expect(
      getVariants(
        normalizeSchema({
          oneOf: [planet],
          properties: {id: {type: "string"}},
          required: ["id"],
        }),
      ),
    ).toEqual([
      {
        properties: {id: {type: "string"}, name: {type: "string"}},
        required: ["id"],
        title: "Planet",
      },
    ])
  })

  test("supports anyOf", () => {
    expect(getVariants({anyOf: [planet]})).toEqual([planet])
  })

  test("ignores unions of plain types", () => {
    const union = {oneOf: [{type: "string"}, {type: "integer"}]}
    expect(getVariants(union)).toBeNull()
    expect(getSchemaTypeLabel(union)).toBe("string | integer")
  })

  test("ignores schemas without alternatives", () => {
    expect(getVariants(planet)).toBeNull()
  })

  test("labels alternatives by title, else by type", () => {
    expect(
      getVariantLabels([
        {enum: ["gh-pages", "master"], type: "string"},
        {properties: {branch: {}}, type: "object"},
        {title: "Planet", type: "object"},
      ]),
    ).toEqual(['"gh-pages" | "master"', "object", "Planet"])
  })

  test("numbers alternatives whose labels would be identical", () => {
    expect(
      getVariantLabels([
        {properties: {a: {}}, type: "object"},
        {properties: {b: {}}, type: "object"},
        {type: "string"},
      ]),
    ).toEqual(["Option 1", "Option 2", "string"])
  })
})
