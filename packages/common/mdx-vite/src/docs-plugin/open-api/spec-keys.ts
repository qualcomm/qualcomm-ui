// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Example payloads and allowed values are data, not spec structure: a
 * `description` or `$ref` inside them is a field of the user's model.
 */
const dataKeys = new Set(["const", "default", "enum", "example", "value"])

/**
 * Maps from user-chosen names to spec objects. Their keys are names, so a
 * property called `example` or a response called `default` isn't data.
 */
const nameMapKeys = new Set([
  "$defs",
  "callbacks",
  "content",
  "definitions",
  "dependentSchemas",
  "encoding",
  "examples",
  "headers",
  "links",
  "mapping",
  "parameters",
  "pathItems",
  "paths",
  "patternProperties",
  "properties",
  "requestBodies",
  "responses",
  "schemas",
  "securitySchemes",
  "variables",
  "webhooks",
])

/**
 * Whether the value of `key`, in a spec object, is payload data. JSON Schema
 * `examples` is an array of payloads; OpenAPI's is a map of Example Objects.
 */
export function isPayload(key: string, value: unknown): boolean {
  return dataKeys.has(key) || (key === "examples" && Array.isArray(value))
}

/**
 * Whether the value of `key`, in a spec object, maps names to spec objects.
 */
export function isNameMap(key: string, value: unknown): boolean {
  return (
    nameMapKeys.has(key) &&
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value)
  )
}
