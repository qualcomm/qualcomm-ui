// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {JsonSchema} from "./schema-type.js"

/**
 * Combines two schemas: later keys win, but properties and array items declared
 * in both are combined recursively, after folding their own `allOf`, and
 * required lists are joined.
 */
function mergeSchemas(base: JsonSchema, next: JsonSchema): JsonSchema {
  const properties = {...base.properties}
  for (const [name, property] of Object.entries(next.properties ?? {})) {
    properties[name] = properties[name]
      ? mergeSchemas(mergeAllOf(properties[name]), mergeAllOf(property))
      : property
  }
  const required = [
    ...new Set([...(base.required ?? []), ...(next.required ?? [])]),
  ]
  const items =
    base.items && next.items
      ? mergeSchemas(mergeAllOf(base.items), mergeAllOf(next.items))
      : (next.items ?? base.items)
  return {
    ...base,
    ...next,
    ...(items ? {items} : {}),
    ...(Object.keys(properties).length ? {properties} : {}),
    ...(required.length ? {required} : {}),
  }
}

/**
 * Folds `allOf` into one schema, with the schema's own keys winning over its
 * parts'. Parts' titles are dropped: they name the parts, not the merged
 * result.
 */
export function mergeAllOf(schema: JsonSchema): JsonSchema {
  if (!schema.allOf?.length) {
    return schema
  }
  const {allOf, ...own} = schema
  return [
    ...allOf.map((part) => {
      const {title: _title, ...rest} = mergeAllOf(part)
      return rest
    }),
    own,
  ].reduce<JsonSchema>(mergeSchemas, {})
}
