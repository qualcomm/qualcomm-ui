// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"

import type {LintSeverity, UnrecognizedConfigKeys} from "./config/index.js"
import {getPathnameFromPathSegments, getRouteKey} from "./nav-builder/index.js"
import {
  type ListedNavRoute,
  ROOT_NAV_CONFIG_SOURCE,
} from "./nav-builder/load-folder-nav.js"
import {
  type FileIssues,
  formatPath,
  pluralize,
  reportFileIssues,
} from "./report-file-issues.js"

export type NavRouteIssue = ListedNavRoute

/**
 * Collects the key of every route and its ancestors, so that a nav entry may
 * reference a folder that only contains nested pages.
 */
export function collectRouteKeys(
  routes: {pathSegments: string[]}[],
): Set<string> {
  const keys = new Set<string>()
  for (const {pathSegments} of routes) {
    if (!pathSegments.length) {
      keys.add("_index")
    }
    for (let depth = 1; depth <= pathSegments.length; depth++) {
      keys.add(getRouteKey(pathSegments.slice(0, depth)))
    }
  }
  return keys
}

/**
 * Finds nav entries whose `id` doesn't match a page or folder. Entries nested in
 * an unmatched entry aren't reported, since their routes can't exist either.
 */
export function validateNavRoutes(
  listedRoutes: ListedNavRoute[],
  routeKeys: ReadonlySet<string>,
): NavRouteIssue[] {
  const issues: NavRouteIssue[] = []
  const unmatched = new Set<string>()
  for (const route of listedRoutes) {
    const key = getRouteKey(route.pathSegments)
    const hasUnmatchedAncestor = route.pathSegments.some((_, index) =>
      unmatched.has(getRouteKey(route.pathSegments.slice(0, index))),
    )
    if (hasUnmatchedAncestor || routeKeys.has(key)) {
      continue
    }
    unmatched.add(key)
    issues.push(route)
  }
  return issues
}

export interface ConfigIssues {
  navRoutes: NavRouteIssue[]
  unrecognizedKeys: UnrecognizedConfigKeys | undefined
}

export function countConfigIssues({
  navRoutes,
  unrecognizedKeys,
}: ConfigIssues): number {
  return navRoutes.length + (unrecognizedKeys?.messages.length ?? 0)
}

/**
 * Logs config issues to the console grouped by file. Issues from the root
 * `navConfig` are listed under the config file.
 */
export function reportConfigIssues(
  issues: ConfigIssues,
  severity: LintSeverity,
): void {
  const configFile = issues.unrecognizedKeys
    ? formatPath(issues.unrecognizedKeys.filePath)
    : ROOT_NAV_CONFIG_SOURCE
  const grouped = new Map<string, FileIssues>()
  const addMessage = (filePath: string, message: string) => {
    const group = grouped.get(filePath) ?? {filePath, messages: []}
    group.messages.push(message)
    grouped.set(filePath, group)
  }

  for (const message of issues.unrecognizedKeys?.messages ?? []) {
    addMessage(configFile, message)
  }
  for (const issue of issues.navRoutes) {
    const id = issue.pathSegments.at(-1)
    addMessage(
      issue.source === ROOT_NAV_CONFIG_SOURCE ? configFile : issue.source,
      `${issue.path}.id: "${id}" doesn't match a page or folder (${getPathnameFromPathSegments(issue.pathSegments)})`,
    )
  }

  reportFileIssues(
    [...grouped.values()],
    `Found ${pluralize(countConfigIssues(issues), "config issue")}:`,
    severity === "error" ? chalk.redBright : chalk.yellowBright,
  )
}
