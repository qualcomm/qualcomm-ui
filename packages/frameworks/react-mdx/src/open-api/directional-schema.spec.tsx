// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {omitDirectional} from "./directional-schema.js"
import {mergeAllOf} from "./merge-all-of.js"
import type {JsonSchema} from "./schema-type.js"

const user: JsonSchema = {
  properties: {
    friends: {
      items: {
        properties: {
          id: {readOnly: true, type: "integer"},
          name: {type: "string"},
        },
        type: "object",
      },
      type: "array",
    },
    id: {readOnly: true, type: "integer"},
    name: {type: "string"},
    password: {type: "string", writeOnly: true},
  },
  required: ["id", "name", "password"],
  type: "object",
}

describe("omitDirectional", () => {
  test("drops read-only properties from requests, at any depth", () => {
    const schema = omitDirectional(user, "request")
    expect(Object.keys(schema.properties!)).toEqual([
      "friends",
      "name",
      "password",
    ])
    expect(schema.required).toEqual(["name", "password"])
    expect(Object.keys(schema.properties!.friends.items!.properties!)).toEqual([
      "name",
    ])
  })

  test("drops write-only properties from responses", () => {
    const schema = omitDirectional(user, "response")
    expect(Object.keys(schema.properties!)).toEqual(["friends", "id", "name"])
    expect(schema.required).toEqual(["id", "name"])
  })

  test("reads the flag through allOf and filters inside variants", () => {
    const schema = omitDirectional(
      {
        oneOf: [
          {
            properties: {
              createdAt: {allOf: [{type: "string"}, {readOnly: true}]},
              kind: {type: "string"},
            },
          },
        ],
      },
      "request",
    )
    expect(Object.keys(schema.oneOf![0].properties!)).toEqual(["kind"])
  })

  test("leaves the input untouched", () => {
    omitDirectional(user, "request")
    expect(Object.keys(user.properties!)).toHaveLength(4)
  })

  test("drops a property marked in one allOf part and redeclared in another", () => {
    const schema = omitDirectional(
      {
        allOf: [
          {
            properties: {id: {readOnly: true, type: "string"}},
            required: ["id"],
          },
          {properties: {id: {description: "The id."}, name: {type: "string"}}},
        ],
      },
      "request",
    )
    expect(Object.keys(mergeAllOf(schema).properties!)).toEqual(["name"])
    expect(mergeAllOf(schema).required).not.toContain("id")
  })
})
