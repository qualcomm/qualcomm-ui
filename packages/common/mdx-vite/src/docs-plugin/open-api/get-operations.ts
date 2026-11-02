// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {resolvePointer} from "./dereference.js"

const httpMethods = [
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
] as const

export type HttpMethod = (typeof httpMethods)[number]

interface OperationObject {
  operationId?: string
  summary?: string
  tags?: string[]
}

export interface TagObject {
  name: string
  summary?: string
  "x-displayName"?: string
}

export interface OpenApiDocument {
  paths?: Record<string, PathItem>
  tags?: TagObject[]
}

export interface OpenApiOperation {
  method: HttpMethod
  path: string
  slug: string
  summary?: string
  tags: string[]
}

/**
 * Fumadocs' fallback, joined into one URL segment so operation URLs stay flat:
 * `GET /planets/{planetId}` → `planets-planetid-get`.
 */
function getFallbackSlug(path: string, method: HttpMethod): string {
  const segments = path
    .toLowerCase()
    .replaceAll(".", "-")
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      segment.startsWith("{") && segment.endsWith("}")
        ? segment.slice(1, -1)
        : segment,
    )
  return [...segments, method].join("-")
}

type PathItem = Partial<Record<HttpMethod, OperationObject>> & {$ref?: string}

/**
 * A path item can itself be a `$ref`, e.g. to `#/components/pathItems/Pets`,
 * possibly through several aliases. A cycle resolves to an empty path item.
 */
function resolvePathItem(
  document: OpenApiDocument,
  pathItem: PathItem,
  seen: ReadonlySet<string> = new Set(),
): PathItem {
  const {$ref, ...siblings} = pathItem
  if (typeof $ref !== "string" || !$ref.startsWith("#/")) {
    return pathItem
  }
  if (seen.has($ref)) {
    return siblings
  }
  const target = resolvePointer(document, $ref) as PathItem | undefined
  return {
    ...(target && resolvePathItem(document, target, new Set([...seen, $ref]))),
    ...siblings,
  }
}

export function getOperations(document: OpenApiDocument): OpenApiOperation[] {
  const operations = new Map<string, OpenApiOperation>()
  for (const [path, rawPathItem] of Object.entries(document.paths ?? {})) {
    const pathItem = resolvePathItem(document, rawPathItem)
    for (const method of httpMethods) {
      const operation = pathItem[method]
      if (!operation) {
        continue
      }
      const slug = operation.operationId ?? getFallbackSlug(path, method)
      const existing = operations.get(slug)
      if (existing) {
        throw new Error(
          `Duplicate OpenAPI operation slug "${slug}": ${existing.method.toUpperCase()} ${existing.path} and ${method.toUpperCase()} ${path}. Give them distinct operationIds.`,
        )
      }
      operations.set(slug, {
        method,
        path,
        slug,
        summary: operation.summary,
        tags: operation.tags ?? [],
      })
    }
  }
  return [...operations.values()]
}
