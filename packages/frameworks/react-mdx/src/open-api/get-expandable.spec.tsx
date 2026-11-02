// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {getExpandable} from "./get-expandable.js"

const pet = {properties: {name: {type: "string"}}, title: "Pet", type: "object"}
const cat = {properties: {meows: {type: "boolean"}}, title: "Cat"}

describe("getExpandable", () => {
  test("expands objects into their properties", () => {
    expect(getExpandable(pet)).toEqual({kind: "object", schema: pet})
  })

  test("expands arrays, nullable ones included, into their items", () => {
    expect(getExpandable({items: pet, type: "array"})).toEqual({
      kind: "object",
      schema: pet,
    })
    expect(getExpandable({items: pet, type: ["array", "null"]})).toEqual({
      kind: "object",
      schema: pet,
    })
  })

  test("finds alternatives on the schema or its items", () => {
    const union = {discriminator: {propertyName: "kind"}, oneOf: [pet, cat]}
    expect(getExpandable(union)).toEqual({
      kind: "variants",
      schema: union,
      variants: [pet, cat],
    })
    expect(getExpandable({items: union, type: "array"})).toMatchObject({
      kind: "variants",
      schema: {discriminator: {propertyName: "kind"}},
    })
  })

  test("doesn't expand plain values", () => {
    expect(getExpandable({type: "string"})).toBeNull()
    expect(getExpandable({items: {type: "string"}, type: "array"})).toBeNull()
    expect(getExpandable(undefined)).toBeNull()
  })
})
