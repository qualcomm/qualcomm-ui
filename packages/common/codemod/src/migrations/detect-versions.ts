// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {existsSync, readFileSync} from "node:fs"
import {dirname, join} from "node:path"
import semver from "semver"

const DEPENDENCY_FIELDS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
] as const

export type DependencyField = (typeof DEPENDENCY_FIELDS)[number]

export type PackageJson = Partial<
  Record<DependencyField, Record<string, string>>
> &
  Record<string, unknown>

export interface DetectedPackage {
  /** Where the package is declared in package.json, if it is. */
  declared?: {field: DependencyField; range: string}
  major: number
  name: string
}

export function readPackageJson(path: string): PackageJson {
  return JSON.parse(readFileSync(path, "utf-8"))
}

function findDeclaration(
  packageJson: PackageJson,
  name: string,
): DetectedPackage["declared"] {
  for (const field of DEPENDENCY_FIELDS) {
    const range = packageJson[field]?.[name]
    if (range) {
      return {field, range}
    }
  }
  return undefined
}

/**
 * Finds the installed version of a package by walking up `node_modules`
 * directories, starting from `cwd`.
 */
function findInstalledVersion(cwd: string, name: string): string | undefined {
  let dir = cwd
  while (true) {
    const path = join(dir, "node_modules", name, "package.json")
    if (existsSync(path)) {
      return readPackageJson(path).version as string | undefined
    }
    const parent = dirname(dir)
    if (parent === dir) {
      return undefined
    }
    dir = parent
  }
}

/**
 * Detects the major version of each package. The range declared in
 * package.json takes precedence. The installed version is used as a fallback
 * when the range isn't valid semver (`workspace:*`, `catalog:`, etc.).
 * Packages that can't be resolved are omitted.
 */
export function detectPackageVersions(
  cwd: string,
  packageJson: PackageJson,
  packageNames: readonly string[],
): Map<string, DetectedPackage> {
  const detected = new Map<string, DetectedPackage>()

  for (const name of packageNames) {
    const declared = findDeclaration(packageJson, name)
    const fromRange =
      declared && semver.validRange(declared.range)
        ? semver.minVersion(declared.range)?.version
        : undefined
    const version = fromRange ?? findInstalledVersion(cwd, name)
    if (version && semver.valid(version)) {
      detected.set(name, {declared, major: semver.major(version), name})
    }
  }

  return detected
}

/**
 * Returns the range that targets the next major version, keeping the `^` or
 * `~` prefix of the original range. Returns undefined for ranges that aren't
 * plain semver (`workspace:*`, `catalog:`, etc.), which must be updated
 * manually.
 */
export function bumpRange(range: string, major: number): string | undefined {
  if (!semver.validRange(range)) {
    return undefined
  }
  const prefix = range.match(/^\s*([~^]?)\d/)?.[1] ?? "^"
  return `${prefix}${major}.0.0`
}
