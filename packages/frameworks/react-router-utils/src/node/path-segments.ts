// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Utilities for converting file paths to route path segments.
 * Uses TanStack Router conventions.
 */

import {sep, win32} from "node:path"

export const INDEX_FILE = "index"
export const ROUTE_FILE = "route"
export const ROOT_FILE = "__root"

/**
 * Result of analyzing a path segment.
 */
export interface SegmentInfo {
  /** Whether this escapes the parent layout (suffix_) */
  escapesLayout: boolean
  /** Whether this is a folder route file (_folder.tsx) */
  isFolderRoute: boolean
  /** Whether this is an index file (index.tsx) */
  isIndex: boolean
  /** Whether this is an index folder used for co-location */
  isIndexFolder: boolean
  /** Whether this is a pathless layout (_prefix) */
  isPathless: boolean
  /** Whether this is a route file (route.tsx) */
  isRoute: boolean
  /** The URL segment to use (empty if this segment doesn't contribute to path) */
  urlSegment: string
}

/**
 * Analyzes a path segment and returns its routing characteristics.
 * This is the single source of truth for how segments map to URLs.
 */
export function analyzeSegment(
  segment: string,
  isLast: boolean,
  parentSegment: string,
): SegmentInfo {
  const isIndex = isLast && segment === INDEX_FILE
  const isRoute = isLast && segment === ROUTE_FILE
  const isFolderRoute = isLast && segment === `_${parentSegment}`
  const isPathless =
    segment.startsWith("_") && !segment.startsWith("__") && !isFolderRoute
  const isIndexFolder = !isLast && segment === INDEX_FILE
  const escapesLayout = segment.endsWith("_")

  // Determine the URL segment
  let urlSegment = segment
  if (isIndex || isRoute || isFolderRoute || isIndexFolder || isPathless) {
    urlSegment = ""
  } else if (escapesLayout) {
    urlSegment = segment.slice(0, -1)
  }

  // Convert params ($param → :param, $ → *, etc.)
  urlSegment = convertParam(urlSegment)

  return {
    escapesLayout,
    isFolderRoute,
    isIndex,
    isIndexFolder,
    isPathless,
    isRoute,
    urlSegment,
  }
}

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

  return processSegments(segments)
}

/**
 * Processes an array of path segments and returns URL path segments.
 * Shared logic used by both getPathSegments and createSimpleRoutingStrategy.
 */
export function processSegments(segments: string[]): string[] {
  if (segments.length === 0) {
    return []
  }

  const fileName = segments[segments.length - 1]

  if (fileName === ROOT_FILE) {
    return []
  }

  const result: string[] = []

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const isLast = i === segments.length - 1
    const parentSegment = i > 0 ? segments[i - 1] : ""

    const info = analyzeSegment(segment, isLast, parentSegment)

    if (info.urlSegment) {
      result.push(info.urlSegment)
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
 * const strategy = createRoutingStrategy({ routeDir: "routes" })
 * strategy("pages/about/index.tsx") // ["about"]
 */
export function createSimpleRoutingStrategy(
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

    return processSegments(segments)
  }
}
