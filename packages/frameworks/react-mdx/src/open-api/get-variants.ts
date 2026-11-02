// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mergeAllOf} from "./merge-all-of.js"
import type {JsonSchema} from "./schema-type.js"

/**
 * The alternatives of a `oneOf`/`anyOf` that need their own table. Unions of
 * plain types like `string | integer` return null: the type label covers them.
 */
export function getVariants(schema: JsonSchema): JsonSchema[] | null {
  const alternatives = (schema.oneOf ?? schema.anyOf)?.map((variant) =>
    mergeAllOf(variant),
  )
  return alternatives?.some((variant) => variant.properties)
    ? alternatives
    : null
}
