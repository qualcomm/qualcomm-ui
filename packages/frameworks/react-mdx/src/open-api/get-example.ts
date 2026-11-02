// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mergeAllOf} from "./merge-all-of.js"
import type {JsonSchema} from "./schema-type.js"

const stringFormats: Record<string, string> = {
  date: "2024-01-01",
  "date-time": "2024-01-01T00:00:00Z",
  email: "user@example.com",
  uri: "https://example.com",
  url: "https://example.com",
  uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
}

const maxDepth = 6

/**
 * A plausible value for a schema, for code samples. The spec's own example,
 * default or first enum value wins; otherwise a placeholder per type. Object
 * examples include every property.
 */
export function getExample(schema: JsonSchema | undefined, depth = 0): unknown {
  if (!schema || schema.circular || depth > maxDepth) {
    return undefined
  }
  const merged = mergeAllOf(schema)
  if (merged.example !== undefined) {
    return merged.example
  }
  if (merged.examples?.length) {
    return merged.examples[0]
  }
  if (merged.default !== undefined) {
    return merged.default
  }
  if (merged.enum?.length) {
    return merged.enum[0]
  }
  const variant = (merged.oneOf ?? merged.anyOf)?.[0]
  if (variant) {
    return getExample(variant, depth)
  }

  const type = Array.isArray(merged.type)
    ? merged.type.find((t) => t !== "null")
    : (merged.type ?? (merged.properties ? "object" : undefined))
  switch (type) {
    case "object":
      return Object.fromEntries(
        Object.entries(merged.properties ?? {}).map(([name, property]) => [
          name,
          getExample(property, depth + 1),
        ]),
      )
    case "array":
      return [getExample(merged.items, depth + 1)].filter(
        (item) => item !== undefined,
      )
    case "string":
      return stringFormats[merged.format ?? ""] ?? "string"
    case "integer":
    case "number":
      return 0
    case "boolean":
      return true
    case "null":
      return null
    default:
      return undefined
  }
}
