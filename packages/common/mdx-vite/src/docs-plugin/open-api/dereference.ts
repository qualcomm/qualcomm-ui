// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isNameMap, isPayload} from "./spec-keys.js"

export function resolvePointer(document: unknown, ref: string): unknown {
  return ref
    .slice(2)
    .split("/")
    .map((segment) => segment.replaceAll("~1", "/").replaceAll("~0", "~"))
    .reduce<unknown>(
      (node, key) =>
        node && typeof node === "object"
          ? (node as Record<string, unknown>)[key]
          : undefined,
      document,
    )
}

const schemaRefPrefix = "#/components/schemas/"

/**
 * Inlines the local `$ref`s of `node`, so the result is plain JSON. A ref back
 * to a schema that is already being inlined is kept as
 * `{$ref, circular: true}` instead of recursing forever. Refs to other files
 * and unknown targets are left untouched, and so are refs inside example data,
 * which is literal. Inlined component schemas without a `title` get their
 * component name as one, so they can still be labelled.
 */
export function dereference<T>(node: T, document: unknown): T {
  function walk(
    value: unknown,
    ancestors: ReadonlySet<string>,
    inNameMap: boolean,
  ): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => walk(item, ancestors, false))
    }
    if (!value || typeof value !== "object") {
      return value
    }

    const {$ref, ...siblings} = value as Record<string, unknown>
    if (!inNameMap && typeof $ref === "string" && $ref.startsWith("#/")) {
      if (ancestors.has($ref)) {
        return {$ref, circular: true}
      }
      const target = resolvePointer(document, $ref)
      if (target !== undefined) {
        const resolved = walk(target, new Set([...ancestors, $ref]), false)
        const title = $ref.startsWith(schemaRefPrefix)
          ? {title: $ref.slice(schemaRefPrefix.length)}
          : {}
        // OpenAPI 3.1 lets keys like `description` sit next to `$ref` and
        // override it.
        return {
          ...title,
          ...(resolved as object),
          ...(walk(siblings, ancestors, false) as object),
        }
      }
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        inNameMap
          ? walk(child, ancestors, false)
          : isPayload(key, child)
            ? child
            : walk(child, ancestors, isNameMap(key, child)),
      ]),
    )
  }
  return walk(node, new Set(), false) as T
}
