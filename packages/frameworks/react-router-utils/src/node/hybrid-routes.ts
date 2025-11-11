// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import minimatch from "minimatch"
import {readdirSync, statSync} from "node:fs"
import {extname, join, relative, resolve, sep} from "node:path"
import win32 from "node:path/win32"

export interface ConfigRoute {
  /**
   * Should be `true` if the `path` is case-sensitive. Defaults to `false`.
   */
  caseSensitive?: boolean
  /**
   * The path to the entry point for this route, relative to
   * `config.appDirectory`.
   */
  file: string
  /**
   * The unique id for this route, named like its `file` but without the
   * extension. So `app/routes/gists/$username.tsx` will have an `id` of
   * `routes/gists/$username`.
   */
  id: string
  /**
   * Should be `true` if it is an index route. This disallows child routes.
   */
  index?: boolean
  /**
   * The unique `id` for this route's parent route, if there is one.
   */
  parentId?: string
  /**
   * The path this route uses to match on the URL pathname.
   */
  path?: string
}
export interface RouteManifest {
  [routeId: string]: ConfigRoute
}

export interface DefineRouteFunction {
  (
    /**
     * The path this route uses to match the URL pathname.
     */
    path: string | undefined,
    /**
     * The path to the file that exports the React component rendered by this
     * route as its default export, relative to the `app` directory.
     */
    file: string,
    /**
     * Options for defining routes, or a function for defining child routes.
     */
    optionsOrChildren?: DefineRouteOptions | DefineRouteChildren,
    /**
     * A function for defining child routes.
     */
    children?: DefineRouteChildren,
  ): void
}

export interface RouteInfo {
  caseSensitive?: boolean
  file: string
  id: string
  // first pass parent is undefined
  index?: boolean
  name: string
  parentId?: string
  path: string
  segments: string[]
}

export interface DefineRouteOptions {
  caseSensitive?: boolean
  index?: boolean
}

export type DefineRouteChildren = {
  (): void
}

export type VisitFilesFunction = (
  dir: string,
  visitor: (file: string) => void,
  baseDir?: string,
) => void

export type FlatRoutesOptions = {
  appDir?: string
  basePath?: string
  defineRoutes?: DefineRoutesFunction
  ignoredRouteFiles?: string[]
  paramPrefixChar?: string
  routeDir?: string | string[]
  routeRegex?: RegExp
  visitFiles?: VisitFilesFunction
}

export type DefineRoutesFunction = (
  callback: (route: DefineRouteFunction) => void,
) => any

const defaultOptions: FlatRoutesOptions = {
  appDir: "app",
  basePath: "/",
  paramPrefixChar: "$",
  routeDir: "routes",
  routeRegex:
    /(([+][\/\\][^\/\\:?*]+)|[\/\\]((index|route|layout|page)|(_[^\/\\:?*]+)|([^\/\\:?*]+\.route)))\.(ts|tsx|js|jsx|md|mdx)$$/,
}
const defaultDefineRoutes = undefined

export function hybridRoutes(
  routeDir: string | string[],
  defineRoutes: DefineRoutesFunction,
  options: FlatRoutesOptions = {},
): RouteManifest {
  const routes = _flatRoutes(
    options.appDir ?? defaultOptions.appDir!,
    options.ignoredRouteFiles ?? [],
    {
      ...defaultOptions,
      ...options,
      defineRoutes,
      routeDir,
    },
  )
  // update undefined parentIds to 'root'
  Object.values(routes).forEach((route) => {
    if (route.parentId === undefined) {
      route.parentId = "root"
    }
  })

  return routes
}

// this function uses the same signature as the one used in core remix
// this way we can continue to enhance this package and still maintain
// compatibility with remix
function _flatRoutes(
  appDir: string,
  ignoredFilePatternsOrOptions?: string[] | FlatRoutesOptions,
  options?: FlatRoutesOptions,
): RouteManifest {
  // get options
  let ignoredFilePatterns: string[] = []
  if (
    ignoredFilePatternsOrOptions &&
    !Array.isArray(ignoredFilePatternsOrOptions)
  ) {
    options = ignoredFilePatternsOrOptions
  } else {
    ignoredFilePatterns = ignoredFilePatternsOrOptions ?? []
  }
  if (!options) {
    options = defaultOptions
  }

  const routeMap: Map<string, RouteInfo> = new Map()
  const nameMap: Map<string, RouteInfo> = new Map()

  const routeDirs = Array.isArray(options.routeDir)
    ? options.routeDir
    : [options.routeDir ?? "routes"]
  const defineRoutes = options.defineRoutes ?? defaultDefineRoutes
  if (!defineRoutes) {
    throw new Error("You must provide a defineRoutes function")
  }
  const visitFiles = options.visitFiles ?? defaultVisitFiles
  const routeRegex = options.routeRegex ?? defaultOptions.routeRegex!

  for (const routeDir of routeDirs) {
    visitFiles(join(appDir, routeDir), (file) => {
      if (
        ignoredFilePatterns &&
        ignoredFilePatterns.some((pattern) =>
          minimatch(file, pattern, {dot: true}),
        )
      ) {
        return
      }

      if (isRouteModuleFile(file, routeRegex)) {
        const routeInfo = getRouteInfo(routeDir, file, options)
        routeMap.set(routeInfo.id, routeInfo)
        nameMap.set(routeInfo.name, routeInfo)
        return
      }
    })
  }
  // update parentIds for all routes
  Array.from(routeMap.values()).forEach((routeInfo) => {
    const parentId = findParentRouteId(routeInfo, nameMap)
    routeInfo.parentId = parentId
  })

  // Then, recurse through all routes using the public defineRoutes() API
  function defineNestedRoutes(
    defineRoute: DefineRouteFunction,
    parentId?: string,
  ): void {
    const childRoutes = Array.from(routeMap.values()).filter(
      (routeInfo) => routeInfo.parentId === parentId,
    )
    const parentRoute = parentId ? routeMap.get(parentId) : undefined
    const parentRoutePath = parentRoute?.path ?? "/"
    for (const childRoute of childRoutes) {
      let routePath = childRoute?.path?.slice(parentRoutePath.length) ?? ""
      // remove leading slash
      if (routePath.startsWith("/")) {
        routePath = routePath.slice(1)
      }
      const index = childRoute.index

      if (index) {
        const invalidChildRoutes = Object.values(routeMap).filter(
          (routeInfo) => routeInfo.parentId === childRoute.id,
        )

        if (invalidChildRoutes.length > 0) {
          throw new Error(
            `Child routes are not allowed in index routes. Please remove child routes of ${childRoute.id}`,
          )
        }

        defineRoute(routePath, routeMap.get(childRoute.id)!.file, {
          index: true,
        })
      } else {
        defineRoute(routePath, routeMap.get(childRoute.id)!.file, () => {
          defineNestedRoutes(defineRoute, childRoute.id)
        })
      }
    }
  }
  const routes = defineRoutes(defineNestedRoutes)
  return routes
}

const routeModuleExts = [".js", ".jsx", ".ts", ".tsx", ".md", ".mdx"]
const serverRegex = /\.server\.(ts|tsx|js|jsx|md|mdx)$/
const indexRouteRegex =
  /((^|[.]|[+]\/)(index|_index))(\/[^\/]+)?$|(\/_?index\/)/

export function isRouteModuleFile(
  filename: string,
  routeRegex: RegExp,
): boolean {
  // flat files only need correct extension
  const isFlatFile = !filename.includes(sep)
  if (isFlatFile) {
    return routeModuleExts.includes(extname(filename))
  }
  const isRoute = routeRegex.test(filename)
  if (isRoute) {
    // check to see if it ends in .server.tsx because you may have
    // a _route.tsx and and _route.server.tsx and only the _route.tsx
    // file should be considered a route
    const isServer = serverRegex.test(filename)
    return !isServer
  }
  return false
}

export function isIndexRoute(routeId: string): boolean {
  return indexRouteRegex.test(routeId)
}

export function getRouteInfo(
  routeDir: string,
  file: string,
  options: FlatRoutesOptions,
) {
  const filePath = normalizeSlashes(join(routeDir, file))
  const routeId = createRouteId(filePath)
  const routeIdWithoutRoutes = routeId.slice(routeDir.length + 1)
  const index = isIndexRoute(routeIdWithoutRoutes)
  const routeSegments = getRouteSegments(
    routeIdWithoutRoutes,
    index,
    options.paramPrefixChar,
  )
  const routePath = createRoutePath(routeSegments, index, options)
  const routeInfo = {
    file: filePath,
    id: routeId,
    index,
    name: routeSegments.join("/"),
    path: routePath!,
    segments: routeSegments,
  }

  return routeInfo
}

// create full path starting with /
export function createRoutePath(
  routeSegments: string[],
  index: boolean,
  options: FlatRoutesOptions,
): string | undefined {
  let result = ""
  const basePath = options.basePath ?? "/"
  const paramPrefixChar = options.paramPrefixChar ?? "$"

  if (index) {
    // replace index with blank
    routeSegments[routeSegments.length - 1] = ""
  }
  for (let i = 0; i < routeSegments.length; i++) {
    let segment = routeSegments[i]
    // skip pathless layout segments
    if (segment.startsWith("_")) {
      continue
    }
    // remove trailing slash
    if (segment.endsWith("_")) {
      segment = segment.slice(0, -1)
    }

    // handle param segments: $ => *, $id => :id
    if (segment.startsWith(paramPrefixChar)) {
      if (segment === paramPrefixChar) {
        result += `/*`
      } else {
        result += `/:${segment.slice(1)}`
      }
      // handle optional segments with param: ($segment) => :segment?
    } else if (segment.startsWith(`(${paramPrefixChar}`)) {
      result += `/:${segment.slice(2, segment.length - 1)}?`
      // handle optional segments: (segment) => segment?
    } else if (segment.startsWith("(")) {
      result += `/${segment.slice(1, segment.length - 1)}?`
    } else {
      result += `/${segment}`
    }
  }
  if (basePath !== "/") {
    result = basePath + result
  }
  return result || undefined
}

function findParentRouteId(
  routeInfo: RouteInfo,
  nameMap: Map<string, RouteInfo>,
): string | undefined {
  let parentName = routeInfo.segments.slice(0, -1).join("/")
  while (parentName) {
    if (nameMap.has(parentName)) {
      return nameMap.get(parentName)!.id
    }
    parentName = parentName.substring(0, parentName.lastIndexOf("/"))
  }
  return undefined
}

export function getRouteSegments(
  name: string,
  index: boolean,
  paramPrefixChar: string = "$",
) {
  let routeSegments: string[] = []
  let i = 0
  let routeSegment = ""
  let state = "START"
  let subState = "NORMAL"
  let hasPlus = false

  // name has already been normalized to use / as path separator

  // replace `+/_.` with `_+/`
  // this supports ability to to specify parent folder will not be a layout
  // _public+/_.about.tsx => _public_.about.tsx

  if (/\+\/_\./.test(name)) {
    name = name.replace(/\+\/_\./g, "_+/")
  }

  // replace `+/` with `.`
  // this supports folders for organizing flat-files convention
  // _public+/about.tsx => _public.about.tsx
  //
  if (/\+\//.test(name)) {
    name = name.replace(/\+\//g, ".")
    hasPlus = true
  }
  const hasFolder = /\//.test(name)
  // if name has plus folder, but we still have regular folders
  // then treat ending route as flat-folders
  if (((hasPlus && hasFolder) || !hasPlus) && !name.endsWith(".route")) {
    // do not remove segments ending in .route
    // since these would be part of the route directory name
    // docs/readme.route.tsx => docs/readme
    // remove last segment since this should just be the
    // route filename and we only want the directory name
    // docs/_layout.tsx => docs
    const last = name.lastIndexOf("/")
    if (last >= 0) {
      name = name.substring(0, last)
    }
  }

  const pushRouteSegment = (routeSegment: string) => {
    if (routeSegment) {
      routeSegments.push(routeSegment)
    }
  }

  while (i < name.length) {
    const char = name[i]
    switch (state) {
      case "START":
        // process existing segment
        if (
          routeSegment.includes(paramPrefixChar) &&
          !(
            routeSegment.startsWith(paramPrefixChar) ||
            routeSegment.startsWith(`(${paramPrefixChar}`)
          )
        ) {
          throw new Error(
            `Route params must start with prefix char ${paramPrefixChar}: ${routeSegment}`,
          )
        }
        if (
          routeSegment.includes("(") &&
          !routeSegment.startsWith("(") &&
          !routeSegment.endsWith(")")
        ) {
          throw new Error(
            `Optional routes must start and end with parentheses: ${routeSegment}`,
          )
        }
        pushRouteSegment(routeSegment)
        routeSegment = ""
        state = "PATH"
        continue // restart without advancing index
      case "PATH":
        if (isPathSeparator(char) && subState === "NORMAL") {
          state = "START"
          break
        } else if (char === "[") {
          subState = "ESCAPE"
          break
        } else if (char === "]") {
          subState = "NORMAL"
          break
        }
        routeSegment += char
        break
    }
    i++ // advance to next character
  }
  // process remaining segment
  pushRouteSegment(routeSegment)
  // strip trailing .route segment
  if (routeSegments.at(-1) === "route") {
    routeSegments = routeSegments.slice(0, -1)
  }
  // if hasPlus, we need to strip the trailing segment if it starts with _
  // and route is not an index route
  // this is to handle layouts in flat-files
  // _public+/_layout.tsx => _public.tsx
  // _public+/index.tsx => _public.index.tsx
  if (!index && hasPlus && routeSegments.at(-1)?.startsWith("_")) {
    routeSegments = routeSegments.slice(0, -1)
  }
  return routeSegments
}

const pathSeparatorRegex = /[\/\\.]/
function isPathSeparator(char: string) {
  return pathSeparatorRegex.test(char)
}

export function defaultVisitFiles(
  dir: string,
  visitor: (file: string) => void,
  baseDir = dir,
) {
  for (const filename of readdirSync(dir)) {
    const file = resolve(dir, filename)
    const stat = statSync(file)

    if (stat.isDirectory()) {
      defaultVisitFiles(file, visitor, baseDir)
    } else if (stat.isFile()) {
      visitor(relative(baseDir, file))
    }
  }
}

export function createRouteId(file: string) {
  return normalizeSlashes(stripFileExtension(file))
}

export function normalizeSlashes(file: string) {
  return file.split(win32.sep).join("/")
}

function stripFileExtension(file: string) {
  return file.replace(/\.[a-z0-9]+$/i, "")
}
