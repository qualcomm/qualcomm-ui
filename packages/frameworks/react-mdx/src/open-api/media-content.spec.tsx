// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {groupMediaTypes, MediaSchema} from "./media-content.js"
import {normalizeSchema} from "./normalize-schema.js"

const pet = {properties: {name: {type: "string"}}, type: "object"}

describe("groupMediaTypes", () => {
  test("merges media types with the same schema", () => {
    expect(
      groupMediaTypes({
        "application/json": {schema: pet},
        "application/xml": {schema: {...pet}},
      }),
    ).toEqual([
      {mediaTypes: ["application/json", "application/xml"], schema: pet},
    ])
  })

  test("ignores XML serialization hints when comparing", () => {
    const xmlPet = {...pet, xml: {name: "pet"}}
    expect(
      groupMediaTypes({
        "application/json": {schema: pet},
        "application/xml": {schema: xmlPet},
      }),
    ).toEqual([
      {mediaTypes: ["application/json", "application/xml"], schema: pet},
    ])
  })

  test("keeps properties named xml when comparing", () => {
    const json = {properties: {xml: {type: "string"}}, type: "object"}
    const xml = {properties: {xml: {type: "integer"}}, type: "object"}
    expect(
      groupMediaTypes({
        "application/json": {schema: json},
        "application/xml": {schema: xml},
      }),
    ).toHaveLength(2)
  })

  test("keeps different schemas apart, in spec order", () => {
    const file = {format: "binary", type: "string"}
    expect(
      groupMediaTypes({
        "application/json": {schema: pet},
        "application/octet-stream": {schema: file},
        "application/xml": {schema: pet},
      }),
    ).toEqual([
      {mediaTypes: ["application/json", "application/xml"], schema: pet},
      {mediaTypes: ["application/octet-stream"], schema: file},
    ])
  })

  test("groups media types without a schema together", () => {
    expect(groupMediaTypes({"text/html": {}, "text/plain": {}})).toEqual([
      {mediaTypes: ["text/html", "text/plain"], schema: undefined},
    ])
  })

  test("returns nothing for missing content", () => {
    expect(groupMediaTypes(undefined)).toEqual([])
  })
})

describe("MediaSchema", () => {
  test("lists the fields of a nullable body, common ones included", async () => {
    const schema = normalizeSchema({
      anyOf: [{properties: {name: {type: "string"}}}, {type: "null"}],
      properties: {id: {type: "string"}},
    })
    await render(
      <MediaSchema group={{mediaTypes: ["application/json"], schema}} />,
    )

    await expect.element(page.getByText("id", {exact: true})).toBeVisible()
    await expect.element(page.getByText("name", {exact: true})).toBeVisible()
  })
})
