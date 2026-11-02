// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {getVariants} from "./get-variants.js"
import {getSchemaTypeLabel} from "./schema-type.js"

const planet = {properties: {name: {type: "string"}}, title: "Planet"}

describe("getVariants", () => {
  test("returns object alternatives, merged", () => {
    expect(
      getVariants({oneOf: [planet, {allOf: [{properties: {orbits: {}}}]}]}),
    ).toEqual([planet, {properties: {orbits: {}}}])
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
})
