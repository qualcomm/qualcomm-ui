// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface JsonSchema {
  $ref?: string
  allOf?: JsonSchema[]
  anyOf?: JsonSchema[]
  circular?: boolean
  default?: unknown
  deprecated?: boolean
  description?: string
  discriminator?: {propertyName: string}
  enum?: unknown[]
  example?: unknown
  examples?: unknown[]
  format?: string
  items?: JsonSchema
  oneOf?: JsonSchema[]
  properties?: Record<string, JsonSchema>
  required?: string[]
  title?: string
  type?: string | string[]
}

function getArrayLabel(items: JsonSchema | undefined): string {
  const label = getSchemaTypeLabel(items)
  return label.includes(" | ") ? `(${label})[]` : `${label}[]`
}

/**
 * Short label for a schema's type, e.g. `integer<int64>`, `Tag[]` or
 * `"available" | "sold"`. Named objects show their title.
 */
export function getSchemaTypeLabel(schema: JsonSchema | undefined): string {
  if (!schema) {
    return "unknown"
  }
  if (schema.circular) {
    return `${schema.$ref?.split("/").pop() ?? "object"} (recursive)`
  }
  if (schema.enum?.length) {
    return schema.enum.map((value) => JSON.stringify(value)).join(" | ")
  }
  if (!schema.type && schema.title) {
    return schema.title
  }
  const alternatives = schema.oneOf ?? schema.anyOf
  if (!schema.type && alternatives?.length) {
    return alternatives.map(getSchemaTypeLabel).join(" | ")
  }
  const types = Array.isArray(schema.type)
    ? schema.type
    : [schema.type ?? "any"]
  return types
    .map((type) =>
      type === "array"
        ? getArrayLabel(schema.items)
        : type === "object" && schema.title
          ? schema.title
          : schema.format && type !== "null"
            ? `${type}<${schema.format}>`
            : type,
    )
    .join(" | ")
}
