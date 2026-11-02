// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getVariants} from "./get-variants.js"
import {mergeAllOf} from "./merge-all-of.js"
import type {JsonSchema} from "./schema-type.js"

export type Expandable =
  | {kind: "object"; schema: JsonSchema}
  | {kind: "variants"; schema: JsonSchema; variants: JsonSchema[]}

function isArray(schema: JsonSchema): boolean {
  return Array.isArray(schema.type)
    ? schema.type.includes("array")
    : schema.type === "array"
}

/**
 * What a property row expands into: the properties of an object, or the
 * alternatives of a oneOf/anyOf. Arrays, nullable ones included, expand into
 * their items.
 */
export function getExpandable(
  schema: JsonSchema | undefined,
): Expandable | null {
  if (!schema) {
    return null
  }
  const merged = mergeAllOf(schema)
  const variants = getVariants(merged)
  if (variants) {
    return {kind: "variants", schema: merged, variants}
  }
  if (isArray(merged)) {
    return getExpandable(merged.items)
  }
  return merged.properties ? {kind: "object", schema: merged} : null
}
