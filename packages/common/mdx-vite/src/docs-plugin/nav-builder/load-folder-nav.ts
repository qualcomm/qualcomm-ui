// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import {glob} from "glob"
import {readFileSync} from "node:fs"
import {dirname, relative} from "node:path"
import type {z} from "zod"

import {navFileSchema} from "../config/config-schema.js"
import type {RoutingStrategy} from "../config/types.js"
import {fixPath} from "../path-utils.js"

import {getRouteKey} from "./get-route-meta.js"
import {getFolderPathSegments, getPathnameFromPathSegments} from "./page-map.js"
import type {FolderNavConfig, NavConfig, RouteMeta} from "./types.js"

export const NAV_FILE_NAME = "_nav.json"

const ROOT_CONFIG_SOURCE = "navConfig"

export interface FolderNavOptions {
  /**
   * Name of the directory where the MDX pages are located.
   */
  pageDirectory: string
  /**
   * Full path to the page directory.
   */
  routesDir: string
  routingStrategy?: RoutingStrategy
  /**
   * Resolved path to the app directory.
   */
  srcDir: string
  throwOnError?: boolean
}

export interface FolderNavResult {
  /**
   * Number of `_nav.json` files that were skipped because they are invalid.
   */
  errorCount: number
  /**
   * The root nav config merged with every valid `_nav.json` file.
   */
  navConfig: NavConfig[]
  /**
   * Keys of routes that were created only to reach a nested `_nav.json` file.
   * They have no properties of their own.
   */
  structuralRoutes: Set<string>
  /**
   * Keys of routes that were added by a `_nav.json` file and that the parent's nav
   * config doesn't list. These have no position among their siblings.
   */
  unorderedRoutes: Set<string>
}

interface NavFile {
  filePath: string
  pathSegments: string[]
}

interface NavFileIssues {
  filePath: string
  messages: string[]
}

interface PropertyClaim {
  pathSegments: string[]
  property: string
}

type FolderNavEntry = Omit<FolderNavConfig, "$schema">

function getClaimKey({pathSegments, property}: PropertyClaim): string {
  return `${getRouteKey(pathSegments)}#${property}`
}

/**
 * Lists every property that an entry and its descendants define. `id` only
 * references a route, so it doesn't count as a definition. Falsy values like
 * `false` and `[]` do count.
 */
function collectClaims(
  entry: FolderNavEntry | RouteMeta,
  pathSegments: string[],
  claims: PropertyClaim[] = [],
): PropertyClaim[] {
  for (const [property, value] of Object.entries(entry)) {
    if (property !== "id" && property !== "$schema" && value !== undefined) {
      claims.push({pathSegments, property})
    }
  }
  for (const child of entry.children ?? []) {
    collectClaims(child, [...pathSegments, child.id], claims)
  }
  return claims
}

function findDuplicateIds(
  children: RouteMeta[] | undefined,
  pathSegments: string[],
  messages: string[],
): void {
  const ids = new Set<string>()
  for (const child of children ?? []) {
    if (ids.has(child.id)) {
      messages.push(
        `${getPathnameFromPathSegments(pathSegments)}: "${child.id}" is listed more than once in children`,
      )
    }
    ids.add(child.id)
    findDuplicateIds(child.children, [...pathSegments, child.id], messages)
  }
}

function formatPath(filePath: string): string {
  return fixPath(relative(process.cwd(), filePath))
}

function formatSchemaIssue(issue: z.core.$ZodIssue): string {
  const path = issue.path
    .map((key, index) =>
      typeof key === "number"
        ? `[${key}]`
        : `${index === 0 ? "" : "."}${String(key)}`,
    )
    .join("")
  return path ? `${path}: ${issue.message}` : issue.message
}

function readNavFile(
  filePath: string,
  messages: string[],
): FolderNavEntry | undefined {
  let json: unknown
  try {
    json = JSON.parse(readFileSync(filePath, "utf-8"))
  } catch (error) {
    messages.push(
      `invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
    )
    return undefined
  }
  const parsed = navFileSchema.safeParse(json)
  if (!parsed.success) {
    messages.push(...parsed.error.issues.map(formatSchemaIssue))
    return undefined
  }
  const {$schema: _schema, ...entry} = parsed.data
  return entry
}

/**
 * Finds the entry for each segment, creating entries that don't exist yet.
 */
function getOrCreateEntry(
  navConfig: NavConfig[],
  pathSegments: string[],
  result: Pick<FolderNavResult, "structuralRoutes" | "unorderedRoutes">,
): RouteMeta {
  let siblings = navConfig
  let entry: RouteMeta | undefined
  for (let index = 0; index < pathSegments.length; index++) {
    const segment = pathSegments[index]
    const key = getRouteKey(pathSegments.slice(0, index + 1))
    const isAncestor = index < pathSegments.length - 1
    entry = siblings.find(
      (item): item is RouteMeta => "id" in item && item.id === segment,
    )
    if (!entry) {
      entry = {id: segment}
      siblings.push(entry)
      result.unorderedRoutes.add(key)
      if (isAncestor) {
        result.structuralRoutes.add(key)
      }
    }
    if (isAncestor) {
      entry.children ??= []
      siblings = entry.children
    }
  }
  return entry!
}

function reportIssues(
  issues: NavFileIssues[],
  title: string,
  color: typeof chalk.redBright,
): void {
  if (!issues.length) {
    return
  }
  console.debug(`\n${color.bold(title)}`)
  for (const {filePath, messages} of issues) {
    console.debug(`\n  ${chalk.blueBright.bold(formatPath(filePath))}`)
    for (const message of messages) {
      console.debug(`    ${color("x")} ${message}`)
    }
  }
  console.debug("")
}

/**
 * Merges the `_nav.json` files in the page directory into the nav config. Each
 * file describes the route of the folder that contains it. A property of a
 * route may only be defined in one place, so files that redefine a property
 * are skipped entirely.
 *
 * Reads synchronously because the search indexer is constructed and built
 * synchronously.
 */
export function loadFolderNavConfig(
  rootNavConfig: NavConfig[],
  options: FolderNavOptions,
): FolderNavResult {
  const {pageDirectory, routesDir, routingStrategy, srcDir} = options
  const result: FolderNavResult = {
    errorCount: 0,
    navConfig: structuredClone(rootNavConfig),
    structuralRoutes: new Set(),
    unorderedRoutes: new Set(),
  }

  const filePaths = glob
    .sync(`**/${NAV_FILE_NAME}`, {absolute: true, cwd: routesDir})
    .map(fixPath)
  if (!filePaths.length) {
    return result
  }

  const errors: NavFileIssues[] = []
  const warnings: NavFileIssues[] = []
  const navFiles: NavFile[] = []

  for (const filePath of filePaths) {
    const folderPath = dirname(filePath)
    if (folderPath === routesDir) {
      errors.push({
        filePath,
        messages: [
          `${NAV_FILE_NAME} is not supported in the page directory root, define top-level routes in the qui-docs config's navConfig`,
        ],
      })
      continue
    }
    let pathSegments: string[] | undefined
    try {
      pathSegments = getFolderPathSegments(
        folderPath,
        srcDir,
        pageDirectory,
        routingStrategy,
      )
    } catch (error) {
      errors.push({
        filePath,
        messages: [
          `unable to resolve the folder's route: ${error instanceof Error ? error.message : String(error)}`,
        ],
      })
      continue
    }
    if (!pathSegments) {
      warnings.push({
        filePath,
        messages: ["the routing strategy excludes this folder's pages"],
      })
    } else if (!pathSegments.length) {
      errors.push({
        filePath,
        messages: [
          "the folder resolves to the root route, define top-level routes in the qui-docs config's navConfig",
        ],
      })
    } else {
      navFiles.push({filePath, pathSegments})
    }
  }

  // parents are merged before nested files so that an entry's position, set by
  // its parent, exists before the entry's own file is applied.
  navFiles.sort(
    (a, b) =>
      a.pathSegments.length - b.pathSegments.length ||
      a.filePath.localeCompare(b.filePath),
  )

  const owners = new Map<string, string>()
  for (const item of rootNavConfig) {
    if ("id" in item && item.id) {
      for (const claim of collectClaims(item, [item.id])) {
        owners.set(getClaimKey(claim), ROOT_CONFIG_SOURCE)
      }
    }
  }

  for (const {filePath, pathSegments} of navFiles) {
    const messages: string[] = []
    const entry = readNavFile(filePath, messages)
    if (entry) {
      findDuplicateIds(entry.children, pathSegments, messages)
    }
    const claims = entry ? collectClaims(entry, pathSegments) : []
    for (const claim of claims) {
      const owner = owners.get(getClaimKey(claim))
      if (owner) {
        messages.push(
          `${getPathnameFromPathSegments(claim.pathSegments)}: "${claim.property}" is already defined in ${owner}`,
        )
      }
    }
    if (!entry || messages.length) {
      errors.push({filePath, messages})
      continue
    }

    const target = getOrCreateEntry(result.navConfig, pathSegments, result)
    result.structuralRoutes.delete(getRouteKey(pathSegments))
    Object.assign(target, structuredClone(entry))

    const source = formatPath(filePath)
    for (const claim of claims) {
      owners.set(getClaimKey(claim), source)
    }
  }

  result.errorCount = errors.length
  reportIssues(
    warnings,
    `Ignored ${warnings.length} ${NAV_FILE_NAME} file${warnings.length === 1 ? "" : "s"}:`,
    chalk.yellowBright,
  )
  reportIssues(
    errors,
    `Skipped ${errors.length} invalid ${NAV_FILE_NAME} file${errors.length === 1 ? "" : "s"}:`,
    chalk.redBright,
  )

  if (errors.length && options.throwOnError) {
    throw new Error(
      `Found ${errors.length} invalid ${NAV_FILE_NAME} file${errors.length === 1 ? "" : "s"}.`,
    )
  }

  return result
}
