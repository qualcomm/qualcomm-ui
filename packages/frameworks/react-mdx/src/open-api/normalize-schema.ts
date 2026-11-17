// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mergeAllOf} from "./merge-all-of.js"
import type {JsonSchema} from "./schema-type.js"

/**
 * Composes a schema once, so later passes see each node in its final shape:
 * `allOf` is folded, and the fields declared next to a `oneOf`/`anyOf` move
 * into each alternative, since they apply whichever one is picked.
 */
export function normalizeSchema(schema: JsonSchema): JsonSchema {
  if (schema.circular) {
    return schema
  }
  const merged = mergeAllOf(schema)
  const union = merged.oneOf ? "oneOf" : merged.anyOf ? "anyOf" : undefined
  let result: JsonSchema = merged
  if (union) {
    const {properties, required, ...rest} = merged
    const common = properties || required ? {properties, required} : undefined
    result = {
      ...(common ? rest : merged),
      [union]: merged[union]!.map((variant) =>
        normalizeSchema(
          common ? {...mergeAllOf(variant), allOf: [common]} : variant,
        ),
      ),
    }
  }
  if (result.properties) {
    result = {
      ...result,
      properties: Object.fromEntries(
        Object.entries(result.properties).map(([key, property]) => [
          key,
          normalizeSchema(property),
        ]),
      ),
    }
  }
  if (result.items) {
    result = {...result, items: normalizeSchema(result.items)}
  }
  return result
}

type Content = Record<string, {schema?: JsonSchema}>

function normalizeContent<T extends Content>(
  content: T | undefined,
): T | undefined {
  return (
    content &&
    (Object.fromEntries(
      Object.entries(content).map(([mediaType, media]) => [
        mediaType,
        media.schema
          ? {...media, schema: normalizeSchema(media.schema)}
          : media,
      ]),
    ) as T)
  )
}

interface NormalizableOperation {
  parameters: {schema?: JsonSchema}[]
  requestBody?: {content?: Content}
  responses?: Record<string, {content?: Content}>
}

/**
 * {@link normalizeSchema} applied to the schemas of every parameter, of the
 * request body and of every response.
 */
export function normalizeOperation<T extends NormalizableOperation>(
  operation: T,
): T {
  return {
    ...operation,
    parameters: operation.parameters.map((parameter) =>
      parameter.schema
        ? {...parameter, schema: normalizeSchema(parameter.schema)}
        : parameter,
    ),
    requestBody: operation.requestBody && {
      ...operation.requestBody,
      content: normalizeContent(operation.requestBody.content),
    },
    responses:
      operation.responses &&
      Object.fromEntries(
        Object.entries(operation.responses).map(([code, response]) => [
          code,
          {...response, content: normalizeContent(response.content)},
        ]),
      ),
  }
}
