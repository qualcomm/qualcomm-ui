// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mergeAllOf} from "./merge-all-of.js"
import type {JsonSchema} from "./schema-type.js"

/**
 * The alternatives of a `oneOf`/`anyOf`, merged. Fields declared next to the
 * union are only included once the schema went through `normalizeSchema`.
 */
export function getAlternatives(schema: JsonSchema): JsonSchema[] | undefined {
  return (schema.oneOf ?? schema.anyOf)?.map((variant) => mergeAllOf(variant))
}

/**
 * The alternatives of a `oneOf`/`anyOf` that need their own table. Unions of
 * plain types like `string | integer` return null: the type label covers them.
 */
export function getVariants(schema: JsonSchema): JsonSchema[] | null {
  const alternatives = getAlternatives(schema)
  return alternatives?.some((variant) => variant.properties)
    ? alternatives
    : null
}
