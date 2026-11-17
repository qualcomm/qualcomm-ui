// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {mergeAllOf} from "./merge-all-of.js"
import type {JsonSchema} from "./schema-type.js"

export type SchemaDirection = "request" | "response"

/**
 * Removes the properties that never travel in `direction`: `readOnly` ones are
 * set by the server and not sent, `writeOnly` ones are sent but never
 * returned.
 */
export function omitDirectional(
  schema: JsonSchema,
  direction: SchemaDirection,
): JsonSchema {
  const omitted = direction === "request" ? "readOnly" : "writeOnly"

  function visit(schema: JsonSchema): JsonSchema {
    if (schema.circular) {
      return schema
    }
    // A property dropped from one allOf part could come back from another.
    const node = mergeAllOf(schema)
    const result = {...node}
    if (node.properties) {
      const removed = new Set<string>()
      result.properties = {}
      for (const [name, property] of Object.entries(node.properties)) {
        if (mergeAllOf(property)[omitted]) {
          removed.add(name)
        } else {
          result.properties[name] = visit(property)
        }
      }
      if (node.required && removed.size) {
        result.required = node.required.filter((name) => !removed.has(name))
      }
    }
    if (node.items) {
      result.items = visit(node.items)
    }
    for (const key of ["anyOf", "oneOf"] as const) {
      if (node[key]) {
        result[key] = node[key].map(visit)
      }
    }
    return result
  }

  return visit(schema)
}

/**
 * {@link omitDirectional} applied to the schema of every media type.
 */
export function omitDirectionalContent<
  T extends Record<string, {schema?: JsonSchema}>,
>(content: T | undefined, direction: SchemaDirection): T | undefined {
  if (!content) {
    return content
  }
  return Object.fromEntries(
    Object.entries(content).map(([mediaType, media]) => [
      mediaType,
      media.schema
        ? {...media, schema: omitDirectional(media.schema, direction)}
        : media,
    ]),
  ) as T
}

interface DirectionalOperation {
  requestBody?: {content?: Record<string, {schema?: JsonSchema}>}
  responses?: Record<string, {content?: Record<string, {schema?: JsonSchema}>}>
}

/**
 * {@link omitDirectional} applied to the request body, for requests, and to
 * every response, for responses.
 */
export function omitDirectionalOperation<T extends DirectionalOperation>(
  operation: T,
): T {
  return {
    ...operation,
    requestBody: operation.requestBody && {
      ...operation.requestBody,
      content: omitDirectionalContent(operation.requestBody.content, "request"),
    },
    responses:
      operation.responses &&
      Object.fromEntries(
        Object.entries(operation.responses).map(([code, response]) => [
          code,
          {
            ...response,
            content: omitDirectionalContent(response.content, "response"),
          },
        ]),
      ),
  }
}
