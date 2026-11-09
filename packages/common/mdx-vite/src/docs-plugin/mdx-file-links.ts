// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Element, Root as HastRoot} from "hast"
import type {Link, Root as MdastRoot} from "mdast"
import {posix} from "node:path"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

import type {RoutingStrategy} from "./config/index.js"
import {
  getPathnameFromPathSegments,
  getPathSegmentsFromFileName,
} from "./nav-builder/index.js"
import {fixPath, realPath} from "./path-utils.js"

export interface MdxFileLinkOptions {
  /**
   * Resolved path to the directory containing the MDX pages, with symlinks
   * resolved. See {@link realPath}.
   */
  routesDir: string

  /**
   * Strategy used to build each route's path segments.
   */
  routingStrategy?: RoutingStrategy
}

const schemePattern = /^[a-z][a-z\d+.-]*:/i

/**
 * Whether the URL is a relative path to an `.mdx` file, like `./page.mdx` or
 * `../button+/_button.mdx#size`. These links resolve against the source file on
 * disk, which keeps them working in GitHub's markdown viewer.
 */
export function isMdxFileLink(url: string): boolean {
  if (!url || url.startsWith("/") || url.startsWith("#")) {
    return false
  }
  if (schemePattern.test(url)) {
    return false
  }
  const [path] = url.split("#", 1)
  return path.endsWith(".mdx")
}

/**
 * Whether the file is inside the routes directory after resolving symlinks.
 * Pages symlinked from outside the routes directory, like docs shared between
 * sites, resolve file links against their real location, so they must keep
 * using URL paths.
 */
export function isInRoutesDir(file: string, routesDir: string): boolean {
  return realPath(file).startsWith(`${fixPath(routesDir).replace(/\/$/, "")}/`)
}

/**
 * Resolves a relative `.mdx` file link to the route pathname of the target page.
 * Returns null if the URL is not a file link or the target is outside the routes
 * directory.
 *
 * @param sourceFile path of the linking file with symlinks resolved, matching the
 * module ID Vite passes to the MDX compiler.
 */
export function resolveMdxFileLink(
  url: string,
  sourceFile: string,
  options: MdxFileLinkOptions,
): {fragment?: string; pathname: string} | null {
  if (!isMdxFileLink(url)) {
    return null
  }

  const [rawPath, fragment] = url.split("#", 2)
  let decodedPath: string
  try {
    decodedPath = decodeURIComponent(rawPath)
  } catch {
    return null
  }

  const routesDir = fixPath(options.routesDir).replace(/\/$/, "")
  /**
   * `posix.join` instead of `posix.resolve`, which treats Windows drive paths
   * like `C:/repo` as relative and prepends the working directory.
   */
  const targetFile = posix.join(posix.dirname(fixPath(sourceFile)), decodedPath)
  if (!targetFile.startsWith(`${routesDir}/`)) {
    return null
  }

  const pathname = getPathnameFromPathSegments(
    getPathSegmentsFromFileName(targetFile, routesDir, options.routingStrategy),
  )

  return {fragment: fragment || undefined, pathname}
}

/**
 * Like {@link resolveMdxFileLink}, but returns the rewritten URL.
 */
export function rewriteMdxFileLink(
  url: string,
  sourceFile: string,
  options: MdxFileLinkOptions,
): string | null {
  const resolved = resolveMdxFileLink(url, sourceFile, options)
  if (!resolved) {
    return null
  }
  return resolved.fragment
    ? `${resolved.pathname}#${resolved.fragment}`
    : resolved.pathname
}

/**
 * Rewrites relative `.mdx` file links in rendered pages to their route pathnames.
 */
export const rehypeMdxFileLinks: Plugin<[MdxFileLinkOptions], HastRoot> = (
  options,
) => {
  return (tree, file) => {
    if (!file.path) {
      return
    }
    const sourceFile = realPath(file.path)
    visit(tree, "element", (node: Element) => {
      const href = node.properties.href
      if (node.tagName !== "a" || typeof href !== "string") {
        return
      }
      const rewritten = rewriteMdxFileLink(href, sourceFile, options)
      if (rewritten) {
        node.properties.href = rewritten
      }
    })
  }
}

/**
 * Rewrites relative `.mdx` file links in a markdown tree to their route
 * pathnames. Used by pipelines that don't receive the source file path through
 * the vfile.
 */
export function remarkMdxFileLinks(
  sourceFile: string,
  options: MdxFileLinkOptions,
): Plugin<[], MdastRoot> {
  return () => (tree) => {
    const realSourceFile = realPath(sourceFile)
    visit(tree, "link", (node: Link) => {
      const rewritten = rewriteMdxFileLink(node.url, realSourceFile, options)
      if (rewritten) {
        node.url = rewritten
      }
    })
  }
}
