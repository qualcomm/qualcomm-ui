// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {getSchemaTypeLabel} from "./schema-type.js"

describe("getSchemaTypeLabel", () => {
  test("shows the type with its format", () => {
    expect(getSchemaTypeLabel({format: "int64", type: "integer"})).toBe(
      "integer<int64>",
    )
  })

  test("lists enum values", () => {
    expect(
      getSchemaTypeLabel({enum: ["available", "sold"], type: "string"}),
    ).toBe('"available" | "sold"')
  })

  test("labels arrays by their items", () => {
    expect(getSchemaTypeLabel({items: {type: "string"}, type: "array"})).toBe(
      "string[]",
    )
  })

  test("wraps union items in parentheses", () => {
    expect(
      getSchemaTypeLabel({
        items: {enum: ["available", "sold"], type: "string"},
        type: "array",
      }),
    ).toBe('("available" | "sold")[]')
    expect(
      getSchemaTypeLabel({items: {type: ["string", "null"]}, type: "array"}),
    ).toBe("(string | null)[]")
  })

  test("joins 3.1 type arrays and skips the format on null", () => {
    expect(getSchemaTypeLabel({format: "date", type: ["string", "null"]})).toBe(
      "string<date> | null",
    )
  })

  test("names objects by their title", () => {
    expect(getSchemaTypeLabel({title: "Pet", type: "object"})).toBe("Pet")
    expect(
      getSchemaTypeLabel({
        items: {title: "Tag", type: "object"},
        type: "array",
      }),
    ).toBe("Tag[]")
    expect(getSchemaTypeLabel({title: "Id", type: "string"})).toBe("string")
  })

  test("names recursive schemas", () => {
    expect(
      getSchemaTypeLabel({
        $ref: "#/components/schemas/Category",
        circular: true,
      }),
    ).toBe("Category (recursive)")
  })

  test("falls back for missing schemas and types", () => {
    expect(getSchemaTypeLabel(undefined)).toBe("unknown")
    expect(getSchemaTypeLabel({})).toBe("any")
  })
})
