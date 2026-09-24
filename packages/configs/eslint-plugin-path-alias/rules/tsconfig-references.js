// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {existsSync, readFileSync} from "node:fs"
import {dirname, join, parse, resolve as resolvePath} from "node:path"
import ts from "typescript"

const tsconfigCache = new Map()
const projectTsconfigCache = new Map()

function readTsconfig(tsconfigPath) {
  if (tsconfigCache.has(tsconfigPath)) {
    return tsconfigCache.get(tsconfigPath)
  }

  const {config, error} = ts.readConfigFile(tsconfigPath, (filename) => {
    try {
      return readFileSync(filename, "utf8")
    } catch {
      return undefined
    }
  })
  const result = error ? null : config
  tsconfigCache.set(tsconfigPath, result)
  return result
}

export function findTsconfig(startPath) {
  let currentDir = dirname(resolvePath(startPath))
  while (parse(currentDir).root !== currentDir) {
    const tsconfigPath = join(currentDir, "tsconfig.json")
    if (existsSync(tsconfigPath)) {
      return tsconfigPath
    }
    currentDir = dirname(currentDir)
  }
  return null
}

export function getProjectTsconfigs(tsconfigPath) {
  const rootTsconfigPath = resolvePath(tsconfigPath)
  if (projectTsconfigCache.has(rootTsconfigPath)) {
    return projectTsconfigCache.get(rootTsconfigPath)
  }

  const tsconfigs = []
  const visitedTsconfigPaths = new Set()

  function visit(currentTsconfigPath) {
    const normalizedTsconfigPath = resolvePath(currentTsconfigPath)
    if (visitedTsconfigPaths.has(normalizedTsconfigPath)) {
      return
    }
    visitedTsconfigPaths.add(normalizedTsconfigPath)

    const tsconfig = readTsconfig(normalizedTsconfigPath)
    if (!tsconfig) {
      return
    }

    tsconfigs.push({path: normalizedTsconfigPath, tsconfig})

    const references = Array.isArray(tsconfig.references)
      ? tsconfig.references
      : []
    for (const reference of references) {
      if (typeof reference.path !== "string") {
        continue
      }
      const referencePath = ts.resolveProjectReferencePath({
        path: resolvePath(dirname(normalizedTsconfigPath), reference.path),
      })
      visit(referencePath)
    }
  }

  visit(rootTsconfigPath)
  projectTsconfigCache.set(rootTsconfigPath, tsconfigs)
  return tsconfigs
}
