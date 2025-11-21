// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {join} from "node:path"

import {capitalCase} from "@qualcomm-ui/utils/change-case"

import type {RouteMetaInternal, RoutingStrategy} from "../../../types"

import {getRouteMeta} from "./get-route-meta"

export function getPathnameFromPathSegments(segments: string[]) {
  return `/${segments.join("/")}`
}

export function getCategoriesFromPathSegments(
  segments: string[],
  metaJson: RouteMetaInternal,
  // the frontmatter title only applies to the last segment.
  frontmatterTitle: string,
): string[] {
  return segments.reduce((acc: string[], segment, index) => {
    const pathSegments = segments.slice(0, index + 1)
    if (index === segments.length - 1) {
      acc.push(frontmatterTitle)
      return acc
    }
    const meta = getRouteMeta(pathSegments, metaJson)
    if (meta?.title) {
      acc.push(meta.title)
    } else {
      acc.push(pathSegmentToCategory(segment))
    }
    return acc
  }, [])
}

// fallback for unmatched path segments
export function pathSegmentToCategory(segment: string): string {
  // we don't transform words like `a`, `or`, and `and`
  return segment
    .split("-")
    .map((segment) =>
      /\b(a|an|and|but|or|in|on|at)\b/.test(segment)
        ? segment
        : capitalCase(segment),
    )
    .join(" ")
}

function getGeneroutedPathSegments(filePath: string): string[] {
  const extension = filePath.endsWith("mdx") ? "mdx" : "tsx"

  const segments = filePath
    .substring(0, filePath.lastIndexOf(`.${extension}`))
    .split("/")

  if (segments[segments.length - 1] === "index") {
    return segments.slice(0, segments.length - 1)
  }
  return segments
}

const pathSeparatorRegex = /[\/\\.]/
function isPathSeparator(char: string) {
  return pathSeparatorRegex.test(char)
}

const indexRouteRegex =
  /((^|[.]|[+]\/)(index|_index))(\/[^\/]+)?$|(\/_?index\/)/

function getRemixFlatRoutesSegments(
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

  // ignore layout routes
  if (name.endsWith("_layout")) {
    return []
  }

  /*
   * name has already been normalized to use / as path separator.
   * replace `+/_.` with `_+/`
   * this supports the ability to specify parent folder will not be a layout.
   * _public+/_.about.tsx => _public_.about.tsx
   */
  if (/\+\/_\./.test(name)) {
    name = name.replace(/\+\/_\./g, "_+/")
  }

  /*
   * replace `+/` with `.`
   * this supports folders for organizing flat-files convention.
   * _public+/about.tsx => _public.about.tsx
   */
  if (/\+\//.test(name)) {
    name = name.replace(/\+\//g, ".")
    hasPlus = true
  }
  const hasFolder = /\//.test(name)
  // if name has plus folder, but we still have regular folders
  // then treat ending route as flat-folders
  if (
    ((hasPlus && hasFolder) || !hasPlus) &&
    !(name.endsWith(".route") || name.endsWith(".index"))
  ) {
    // Do not remove segments ending in .route
    // since these would be part of the route directory name
    // docs/readme.route.tsx => docs/readme
    // Remove last segment since this should just be the route filename, and we only
    // want the directory name docs/_layout.tsx => docs
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
  if (
    routeSegments.at(-1) === "route" ||
    routeSegments.at(-1) === "index" ||
    routeSegments.at(-1) === "_index" ||
    routeSegments.at(-1) === "_route"
  ) {
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

function getRemixHybridRoutesPathSegments(filePath: string): string[] {
  const routeWithoutExtension = filePath.substring(0, filePath.lastIndexOf("."))

  return getRemixFlatRoutesSegments(
    routeWithoutExtension,
    indexRouteRegex.test(routeWithoutExtension),
  )
}

export function getPathSegmentsFromFileName(
  filePath: string,
  pageDirectory: string,
  strategy?: RoutingStrategy,
): string[] {
  const filePathWithoutPageDirectory = filePath.substring(
    filePath.indexOf(pageDirectory) + pageDirectory.length + 1,
  )
  if (typeof strategy === "function") {
    return strategy(filePathWithoutPageDirectory)
  }
  switch (strategy) {
    case "vite-generouted":
      return getGeneroutedPathSegments(filePathWithoutPageDirectory)
    default:
      return getRemixHybridRoutesPathSegments(filePathWithoutPageDirectory)
  }
}

export function filterFileGlob(
  fileGlob: string[],
  ext: string,
  srcDir: string,
  router?: RoutingStrategy,
): string[] {
  if (typeof router === "string" && router === "vite-generouted") {
    // vite-generouted: filter routes
    const restrictedPattern = /(\(.*\))|(\[.*\])/
    // pull out the full path before filtering to avoid potential issues with
    // parent directories.
    const relativeGlobs = fileGlob.map((file) => file.replace(srcDir, ""))
    return (
      relativeGlobs
        .filter(
          (file) =>
            file.endsWith(`.${ext}`) &&
            !file.includes("/_") &&
            !file.includes("/+"),
        )
        // filter pathless segments
        .map((file) =>
          file
            .split("/")
            .filter((segment) => !restrictedPattern.test(segment))
            .join("/"),
        )
        // restore full path
        .map((file) => join(srcDir, file))
    )
  }
  return fileGlob.filter((file) => file.endsWith(ext) && !file.includes("$"))
}
