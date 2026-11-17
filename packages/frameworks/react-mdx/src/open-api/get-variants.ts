// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mergeAllOf} from "./merge-all-of.js"
import {getSchemaTypeLabel, type JsonSchema} from "./schema-type.js"

/**
 * The alternatives of a `oneOf`/`anyOf`, merged. Fields declared next to the
 * union are only included once the schema went through `normalizeSchema`.
 */
export function getAlternatives(schema: JsonSchema): JsonSchema[] | undefined {
  return (schema.oneOf ?? schema.anyOf)?.map((variant) => mergeAllOf(variant))
}

export function isArraySchema(schema: JsonSchema): boolean {
  return Array.isArray(schema.type)
    ? schema.type.includes("array")
    : schema.type === "array"
}

/**
 * Whether a schema has fields to list: properties, or array items with some.
 */
function hasFields(schema: JsonSchema): boolean {
  const merged = mergeAllOf(schema)
  return (
    !!merged.properties ||
    (isArraySchema(merged) && !!merged.items && hasFields(merged.items))
  )
}

/**
 * The one other alternative of a union with `null`, like
 * `anyOf: [Pet, {type: "null"}]`: such a union is just a nullable Pet.
 */
export function getNullableAlternative(
  schema: JsonSchema,
): JsonSchema | undefined {
  const alternatives = getAlternatives(schema)
  const others = alternatives?.filter((variant) => variant.type !== "null")
  return alternatives && alternatives.length > 1 && others?.length === 1
    ? others[0]
    : undefined
}

/**
 * The alternatives of a `oneOf`/`anyOf` that need their own table. Unions of
 * plain types like `string | integer` return null: the type label covers them.
 */
export function getVariants(schema: JsonSchema): JsonSchema[] | null {
  if (getNullableAlternative(schema)) {
    return null
  }
  const alternatives = getAlternatives(schema)
  return alternatives?.some(hasFields) ? alternatives : null
}

/**
 * A label per alternative: its title, else its type. Alternatives whose labels
 * would be identical, like two untitled objects, are numbered instead.
 */
export function getVariantLabels(variants: JsonSchema[]): string[] {
  const labels = variants.map(
    (variant) => variant.title ?? getSchemaTypeLabel(variant),
  )
  return labels.map((label, index) =>
    labels.indexOf(label) === labels.lastIndexOf(label)
      ? label
      : `Option ${index + 1}`,
  )
}
