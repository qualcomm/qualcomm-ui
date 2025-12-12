// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Utilities for converting file paths to route path segments.
 * Uses TanStack Router conventions.
 */

import {sep, win32} from "node:path"

const INDEX_FILE = "index"
const ROUTE_FILE = "route"
const ROOT_FILE = "__root"

/**
 * Converts a file path to an array of URL path segments following TanStack Router
 * conventions.
 *
 * @example
 * getPathSegments("routes/about.tsx") // ["about"]
 * getPathSegments("routes/posts/$postId.tsx") // ["posts", ":postId"]
 * getPathSegments("routes/posts/index.tsx") // ["posts"]
 * getPathSegments("routes/_auth/login.tsx") // ["login"]
 * getPathSegments("routes/files/$.tsx") // ["files", "*"]
 */
export function getPathSegments(filePath: string): string[] {
  const normalized = normalizeSlashes(filePath)
  const withoutExt = stripExtension(normalized)
  const parts = withoutExt.split("/")

  // Filter out route directory prefix (e.g., "routes")
  const startIndex = parts[0] === "routes" ? 1 : 0
  const segments = parts.slice(startIndex)

  if (segments.length === 0) {
    return []
  }

  const result: string[] = []
  const fileName = segments[segments.length - 1]

  // Skip root files
  if (fileName === ROOT_FILE) {
    return []
  }

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const isLast = i === segments.length - 1
    const parentSegment = i > 0 ? segments[i - 1] : ""

    // Skip index and route files - they don't add to the path
    if (isLast && (segment === INDEX_FILE || segment === ROUTE_FILE)) {
      continue
    }

    // Skip _folder.tsx pattern (e.g., about/_about.tsx)
    if (isLast && segment === `_${parentSegment}`) {
      continue
    }

    // Skip pathless layouts (leading _)
    if (segment.startsWith("_") && !segment.startsWith("__")) {
      continue
    }

    // Handle layout escaping (trailing _)
    let urlSegment = segment
    if (segment.endsWith("_")) {
      urlSegment = segment.slice(0, -1)
    }

    // Convert params
    urlSegment = convertParam(urlSegment)

    if (urlSegment) {
      result.push(urlSegment)
    }
  }

  return result
}

/**
 * Converts a segment with param syntax to router param syntax.
 * - `$` → `*` (splat)
 * - `$param` → `:param`
 * - `($param)` → `:param?` (optional param)
 * - `(segment)` → `segment?` (optional segment)
 */
export function convertParam(segment: string): string {
  if (segment === "$") {
    return "*"
  }
  if (segment.startsWith("$")) {
    return `:${segment.slice(1)}`
  }
  if (segment.startsWith("($") && segment.endsWith(")")) {
    return `:${segment.slice(2, -1)}?`
  }
  if (segment.startsWith("(") && segment.endsWith(")")) {
    return `${segment.slice(1, -1)}?`
  }
  return segment
}

/**
 * Strips file extension from a path.
 */
export function stripExtension(file: string): string {
  return file.replace(/\.[^/.]+$/, "")
}

/**
 * Normalizes path separators to forward slashes.
 */
export function normalizeSlashes(file: string): string {
  return file.split(win32.sep).join("/").split(sep).join("/")
}

/**
 * Creates a routing strategy function for the docs-plugin.
 * Can be configured to strip a custom route directory prefix.
 *
 * @example
 * const strategy = createRoutingStrategy({ routeDir: "pages" })
 * strategy("pages/about/index.tsx") // ["about"]
 */
export function createRoutingStrategy(
  options: {
    routeDir?: string
  } = {},
): (filePath: string) => string[] {
  const routeDir = options.routeDir ?? "routes"

  return (filePath: string): string[] => {
    const normalized = normalizeSlashes(filePath)
    const withoutExt = stripExtension(normalized)
    const parts = withoutExt.split("/")

    // Find and skip the route directory prefix
    const routeDirIndex = parts.indexOf(routeDir)
    const startIndex = routeDirIndex >= 0 ? routeDirIndex + 1 : 0
    const segments = parts.slice(startIndex)

    if (segments.length === 0) {
      return []
    }

    const result: string[] = []
    const fileName = segments[segments.length - 1]

    if (fileName === ROOT_FILE) {
      return []
    }

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      const isLast = i === segments.length - 1
      const parentSegment = i > 0 ? segments[i - 1] : ""

      if (isLast && (segment === INDEX_FILE || segment === ROUTE_FILE)) {
        continue
      }

      if (isLast && segment === `_${parentSegment}`) {
        continue
      }

      if (segment.startsWith("_") && !segment.startsWith("__")) {
        continue
      }

      let urlSegment = segment
      if (segment.endsWith("_")) {
        urlSegment = segment.slice(0, -1)
      }

      urlSegment = convertParam(urlSegment)

      if (urlSegment) {
        result.push(urlSegment)
      }
    }

    return result
  }
}
