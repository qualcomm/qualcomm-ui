// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {omitDirectional} from "./directional-schema.js"
import {getExample} from "./get-example.js"
import {normalizeOperation, normalizeSchema} from "./normalize-schema.js"

const name = {name: {type: "string"}}

describe("normalizeSchema", () => {
  test("folds allOf at any depth", () => {
    expect(
      normalizeSchema({
        properties: {pet: {allOf: [{properties: name}, {required: ["name"]}]}},
      }),
    ).toEqual({
      properties: {pet: {properties: name, required: ["name"]}},
    })
  })

  test("moves the fields declared next to oneOf into each alternative", () => {
    expect(
      normalizeSchema({
        oneOf: [{allOf: [{properties: name}]}, {title: "Empty"}],
        properties: {id: {type: "integer"}},
        required: ["id"],
      }),
    ).toEqual({
      oneOf: [
        {properties: {id: {type: "integer"}, ...name}, required: ["id"]},
        {properties: {id: {type: "integer"}}, required: ["id"], title: "Empty"},
      ],
    })
  })

  test("keeps a common read-only field out of requests", () => {
    const schema = normalizeSchema({
      oneOf: [{properties: {secret: {type: "string"}, ...name}}],
      properties: {secret: {readOnly: true, type: "string"}},
    })
    expect(getExample(omitDirectional(schema, "request"))).toEqual({
      name: "string",
    })
  })
})

describe("normalizeOperation", () => {
  test("normalizes parameter, body and response schemas", () => {
    const union = {
      oneOf: [{allOf: [{properties: name}]}],
      properties: {id: {type: "integer"}},
    }
    const media = {"application/json": {schema: union}}
    const operation = normalizeOperation({
      parameters: [{in: "query", name: "filter", schema: union}],
      requestBody: {content: media},
      responses: {"200": {content: media}},
    })
    const expected = {id: 0, name: "string"}
    expect(getExample(operation.parameters[0].schema)).toEqual(expected)
    expect(
      operation.requestBody?.content?.["application/json"].schema?.oneOf,
    ).toHaveLength(1)
    expect(
      getExample(
        operation.responses?.["200"].content?.["application/json"].schema,
      ),
    ).toEqual(expected)
  })
})
