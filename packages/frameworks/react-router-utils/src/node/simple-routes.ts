// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Simple file-based routing following TanStack Router conventions.
 *
 * File/Folder Conventions:
 * - `__root.tsx`           → Root layout (wraps all routes)
 * - `index.tsx`            → Index route for current path
 * - `route.tsx`            → Explicit route file in a folder
 * - `about/_about.tsx`     → Route file for /about (named after parent folder)
 * - `about.tsx`            → Route at /about
 * - `posts.tsx`            → Layout for /posts (if posts/ folder exists)
 * - `posts/index.tsx`      → Index route at /posts
 * - `posts/$postId.tsx`    → Dynamic route /posts/:postId
 * - `posts_/$postId/`      → Escapes posts layout (trailing _)
 * - `_pathless.tsx`        → Pathless layout (leading _)
 * - `_pathless/child.tsx`  → Child inherits pathless layout
 * - `files/$.tsx`          → Splat/catch-all route /files/*
 */

import minimatch from "minimatch"
import {readdirSync, statSync} from "node:fs"
import {extname, join, relative, resolve} from "node:path"

import {
  analyzeSegment,
  INDEX_FILE,
  normalizeSlashes,
  ROOT_FILE,
} from "./path-segments"
import type {DefineRouteFunction} from "./shared"

export interface RouteConfig {
  caseSensitive?: boolean
  file: string
  id: string
  index?: boolean
  parentId?: string
  path?: string
}

export interface SimpleRouteManifest {
  [routeId: string]: RouteConfig
}

export type DefineSimpleRoutesFunction = (
  callback: (route: DefineRouteFunction) => void,
) => SimpleRouteManifest

export interface SimpleRoutesOptions {
  appDir?: string
  basePath?: string
  ignoredFiles?: string[]
}

interface RouteNode {
  children: Map<string, RouteNode>
  file?: string
  id: string
  index?: boolean
  isFolderRoute?: boolean
  isPathless: boolean
  name: string
  path: string
  segment: string
}

const ROUTE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".mdx", ".md"]

export function simpleRoutes(
  routeDir: string,
  defineRoutes: DefineSimpleRoutesFunction,
  options: SimpleRoutesOptions = {},
): SimpleRouteManifest {
  const appDir = options.appDir ?? "app"
  const basePath = options.basePath ?? "/"
  const ignoredFiles = options.ignoredFiles ?? []

  const routesPath = join(appDir, routeDir)
  const files = collectRouteFiles(routesPath, ignoredFiles)

  const tree = buildRouteTree(files, routeDir)

  const routes = defineRoutes((defineRoute) => {
    renderRouteTree(tree, defineRoute, basePath)
  })

  for (const route of Object.values(routes)) {
    if (route.parentId === undefined) {
      route.parentId = "root"
    }
  }

  return routes
}

function collectRouteFiles(dir: string, ignored: string[]): string[] {
  const files: string[] = []

  function visit(currentDir: string, baseDir: string) {
    let entries: string[]
    try {
      entries = readdirSync(currentDir)
    } catch {
      return
    }

    for (const entry of entries) {
      const fullPath = resolve(currentDir, entry)
      const relativePath = relative(baseDir, fullPath)

      if (
        ignored.some((pattern) => minimatch(relativePath, pattern, {dot: true}))
      ) {
        continue
      }

      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        visit(fullPath, baseDir)
      } else if (stat.isFile() && isRouteFile(entry)) {
        files.push(normalizeSlashes(relativePath))
      }
    }
  }

  visit(dir, dir)
  return files
}

function isRouteFile(filename: string): boolean {
  const ext = extname(filename)
  return (
    ROUTE_EXTENSIONS.includes(ext) &&
    !filename.includes(".server.") &&
    !filename.includes(".client.")
  )
}

function buildRouteTree(files: string[], routeDir: string): RouteNode {
  const root: RouteNode = {
    children: new Map(),
    id: routeDir,
    isPathless: false,
    name: "",
    path: "",
    segment: "",
  }

  for (const file of files) {
    const withoutExt = stripExtension(file)
    const segments = withoutExt.split("/")
    const fileName = segments[segments.length - 1]

    // Skip __root files - they're handled separately
    if (fileName === ROOT_FILE) {
      continue
    }

    let current = root
    const pathSegments: string[] = []

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      const isLast = i === segments.length - 1
      const parentSegment = i > 0 ? segments[i - 1] : ""
      const info = analyzeSegment(segment, isLast, parentSegment)

      if (info.isRoute || info.isFolderRoute) {
        current.file = join(routeDir, file)
        if (info.isFolderRoute) {
          current.isFolderRoute = true
        }
        if (parentSegment === INDEX_FILE) {
          current.index = true
        }
        break
      }

      if (!info.isIndex && info.urlSegment) {
        pathSegments.push(info.urlSegment)
      }

      const nodeKey = info.isIndex ? "__index__" : segment

      if (!current.children.has(nodeKey)) {
        const nodePath = pathSegments.join("/")
        current.children.set(nodeKey, {
          children: new Map(),
          id: join(routeDir, segments.slice(0, i + 1).join("/")),
          index: info.isIndex,
          isPathless: info.isPathless,
          name: segment,
          path: nodePath ? `/${nodePath}` : "/",
          segment: info.urlSegment,
        })
      }

      const node = current.children.get(nodeKey)!

      if (isLast) {
        node.file = join(routeDir, file)
        node.index = info.isIndex
      }

      current = node
    }
  }

  return root
}

function renderRouteTree(
  node: RouteNode,
  defineRoute: DefineRouteFunction,
  basePath: string,
  parentPath = "",
): void {
  const children = Array.from(node.children.values())

  // Sort: layouts first, then by name
  children.sort((a, b) => {
    if (a.index !== b.index) {
      return a.index ? 1 : -1
    }
    return a.name.localeCompare(b.name)
  })

  for (const child of children) {
    if (!child.file && child.children.size === 0) {
      continue
    }

    const routePath = getRoutePath(child, parentPath)
    const hasChildren = child.children.size > 0

    if (child.file) {
      if (child.index) {
        // For index routes, check if the parent path matches the expected parent
        // If not (virtual folders), use the full path instead of index: true
        const expectedParent = child.path.replace(/\/$/, "")
        const normalizedParent = parentPath.startsWith("/")
          ? parentPath
          : parentPath
            ? `/${parentPath}`
            : ""
        if (expectedParent === normalizedParent || expectedParent === "/") {
          defineRoute("", child.file, {index: true})
        } else {
          // Virtual folder case - register with full path as regular route
          const fullPath = child.path.startsWith("/")
            ? child.path.slice(1)
            : child.path
          defineRoute(fullPath, child.file)
        }
      } else if (hasChildren) {
        if (child.isFolderRoute) {
          defineRoute(undefined, child.file, () => {
            renderRouteTree(child, defineRoute, basePath, parentPath)
          })
        } else {
          defineRoute(routePath, child.file, () => {
            renderRouteTree(child, defineRoute, basePath, child.path)
          })
        }
      } else {
        defineRoute(routePath, child.file)
      }
    } else if (hasChildren) {
      renderRouteTree(child, defineRoute, basePath, parentPath)
    }
  }
}

function getRoutePath(node: RouteNode, parentPath: string): string {
  if (node.index) {
    return ""
  }

  if (node.isPathless) {
    return ""
  }

  let path = node.path
  if (parentPath && path.startsWith(parentPath)) {
    path = path.slice(parentPath.length)
  }
  if (path.startsWith("/")) {
    path = path.slice(1)
  }

  return path
}

function stripExtension(file: string): string {
  return file.replace(/\.[^/.]+$/, "")
}
