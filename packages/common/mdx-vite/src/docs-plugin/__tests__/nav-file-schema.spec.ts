// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {
  getNavFileJsonSchema,
  navFileSchema,
  parseSchema,
} from "../config/config-schema"

type JsonSchemaNode = {
  $defs?: Record<string, JsonSchemaNode>
  additionalProperties?: boolean
  description?: string
  properties?: Record<string, JsonSchemaNode>
}

function getObjectSchemas(schema: JsonSchemaNode): JsonSchemaNode[] {
  return [schema, ...Object.values(schema.$defs ?? {})]
}

describe("_nav.json schema", () => {
  test("describes every property", () => {
    for (const objectSchema of getObjectSchemas(getNavFileJsonSchema())) {
      for (const [name, property] of Object.entries(
        objectSchema.properties ?? {},
      )) {
        expect(property.description, name).toBeTruthy()
      }
    }
  })

  test("disallows additional properties on every object", () => {
    const objectSchemas = getObjectSchemas(getNavFileJsonSchema())
    expect(objectSchemas.length).toBeGreaterThan(1)
    for (const objectSchema of objectSchemas) {
      expect(objectSchema.additionalProperties).toBe(false)
    }
  })

  test("accepts a folder entry with nested children", () => {
    const result = navFileSchema.safeParse({
      $schema: "./nav.schema.json",
      children: [{children: [{id: "deep-topic"}], id: "advanced"}],
      expanded: true,
      title: "Guide",
    })
    expect(result.success).toBe(true)
  })

  test("rejects an id on the folder entry", () => {
    expect(navFileSchema.safeParse({id: "guide"}).success).toBe(false)
  })

  test("requires an id on children", () => {
    expect(
      navFileSchema.safeParse({children: [{title: "Markdown"}]}).success,
    ).toBe(false)
  })

  test("rejects nav meta properties", () => {
    expect(navFileSchema.safeParse({separator: true}).success).toBe(false)
    expect(
      navFileSchema.safeParse({
        children: [{id: "markdown", sectionTitle: "Guides"}],
      }).success,
    ).toBe(false)
  })

  test("rejects unknown properties in nested children", () => {
    const result = navFileSchema.safeParse({
      children: [{children: [{id: "deep-topic", titel: "Deep"}], id: "a"}],
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual(["children", 0, "children", 0])
  })

  test("still strips unknown properties from the qui-docs config", () => {
    const result = parseSchema({navConfig: [{id: "guide", titel: "Guide"}]})
    expect(result.success).toBe(true)
    expect(result.data?.navConfig).toEqual([{id: "guide"}])
  })
})
