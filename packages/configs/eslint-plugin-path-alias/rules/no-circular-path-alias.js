// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {ESLintUtils} from "@typescript-eslint/utils"
import {existsSync, readFileSync} from "node:fs"
import {
  dirname,
  join,
  parse,
  posix as path,
  resolve as resolvePath,
} from "node:path"
import ts from "typescript"

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`,
)

const tsconfigCache = new Map()
const dependencyGraphCache = new Map()

function readTsconfig(tsconfigPath) {
  if (tsconfigCache.has(tsconfigPath)) {
    return tsconfigCache.get(tsconfigPath)
  }
  const {config, error} = ts.readConfigFile(tsconfigPath, (f) =>
    readFileSync(f, "utf8"),
  )
  tsconfigCache.set(tsconfigPath, error ? null : config)
  return error ? null : config
}

function findNearestTsconfig(file) {
  let dir = dirname(file)
  while (parse(dir).root !== dir) {
    const p = join(dir, "tsconfig.json")
    if (existsSync(p)) {
      return p
    }
    dir = dirname(dir)
  }
  return null
}

function toPosix(p) {
  return path.normalize(p).replace(/\\/g, "/")
}

function resolvePathAlias(importPath, tsconfigDir, paths) {
  for (const [alias, mappings] of Object.entries(paths)) {
    const mappingArray = Array.isArray(mappings) ? mappings : [mappings]

    for (const mapping of mappingArray) {
      let resolvedPath = null

      if (alias.includes("*")) {
        const [aliasPrefix, aliasSuffix = ""] = alias.split("*")
        if (
          importPath.startsWith(aliasPrefix) &&
          importPath.endsWith(aliasSuffix)
        ) {
          const wildcardValue = importPath.slice(
            aliasPrefix.length,
            importPath.length - aliasSuffix.length,
          )
          resolvedPath = mapping.replace("*", wildcardValue)
        }
      } else if (importPath === alias) {
        resolvedPath = mapping
      }

      if (resolvedPath) {
        const finalPath = toPosix(resolvePath(tsconfigDir, resolvedPath))
        const withExtension = addFileExtensionIfNeeded(finalPath)

        // If addFileExtensionIfNeeded found a file, use this mapping
        if (existsSync(withExtension)) {
          return finalPath
        }
      }
    }
  }
  return null
}

function resolveImportPath(importPath, currentFile, tsconfigDir, paths) {
  // Handle relative imports
  if (importPath.startsWith(".")) {
    return toPosix(resolvePath(dirname(currentFile), importPath))
  }

  // Handle path aliases
  const aliasResolved = resolvePathAlias(importPath, tsconfigDir, paths)
  if (aliasResolved) {
    return aliasResolved
  }

  // External modules - return null as we don't track them
  return null
}

function addFileExtensionIfNeeded(filePath) {
  const extensions = [".ts", ".tsx", ".js", ".jsx"]

  // If file already has extension, return as-is
  if (extensions.some((ext) => filePath.endsWith(ext))) {
    return filePath
  }

  // Try to find file with common extensions
  for (const ext of extensions) {
    if (existsSync(`${filePath}${ext}`)) {
      return `${filePath}${ext}`
    }
  }

  // Try index files in directory
  for (const ext of extensions) {
    const indexPath = `${filePath}/index${ext}`
    if (existsSync(indexPath)) {
      return indexPath
    }
  }

  // If nothing found, return original path (might be resolved later)
  return filePath
}

function detectCycle(
  graph,
  startNode,
  visited = new Set(),
  recursionStack = new Set(),
) {
  if (recursionStack.has(startNode)) {
    return [...recursionStack, startNode]
  }

  if (visited.has(startNode)) {
    return null
  }

  visited.add(startNode)
  recursionStack.add(startNode)

  const dependencies = graph.get(startNode) || new Set()

  for (const dependency of dependencies) {
    const cycle = detectCycle(graph, dependency, visited, recursionStack)
    if (cycle) {
      return cycle
    }
  }

  recursionStack.delete(startNode)
  return null
}

function formatCyclePath(cycle) {
  const uniqueCycle = cycle.slice(0, cycle.indexOf(cycle[cycle.length - 1]))
  return uniqueCycle.concat(cycle[cycle.length - 1]).join(" → ")
}

function isTypeOnlyImport(node) {
  // Check if the entire import/export is type-only
  if (node.importKind === "type" || node.exportKind === "type") {
    return true
  }

  // For ImportDeclaration, check if all specifiers are type-only
  if (node.type === "ImportDeclaration" && node.specifiers) {
    return node.specifiers.every(
      (spec) =>
        spec.importKind === "type" ||
        (spec.type === "ImportSpecifier" && spec.importKind === "type"),
    )
  }

  return false
}

export const noCircularPathAlias = createRule({
  create(context) {
    const fileName = context.getFilename()
    const tsconfigPath = findNearestTsconfig(fileName)

    if (!tsconfigPath) {
      return {}
    }

    const tsconfigDir = dirname(tsconfigPath)
    const tsconfig = readTsconfig(tsconfigPath) || {}
    const paths =
      (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) || {}

    // Get or create dependency graph for this project
    const cacheKey = tsconfigPath
    if (!dependencyGraphCache.has(cacheKey)) {
      dependencyGraphCache.set(cacheKey, new Map())
    }
    const dependencyGraph = dependencyGraphCache.get(cacheKey)

    const currentFilePath = toPosix(resolvePath(fileName))

    function addDependency(importPath, node) {
      const resolvedPath = resolveImportPath(
        importPath,
        fileName,
        tsconfigDir,
        paths,
      )

      if (!resolvedPath) {
        return // External module or unresolvable path
      }

      const resolvedWithExt = addFileExtensionIfNeeded(resolvedPath)
      const normalizedResolved = toPosix(resolvedWithExt)
      const normalizedCurrent = toPosix(currentFilePath)

      // Check for self-import first
      if (
        normalizedResolved === normalizedCurrent ||
        normalizedResolved ===
          normalizedCurrent.replace(/\.(ts|tsx|js|jsx)$/, "") ||
        `${normalizedResolved}.ts` === normalizedCurrent ||
        `${normalizedResolved}/index.ts` === normalizedCurrent ||
        normalizedCurrent === `${normalizedResolved}/index.ts`
      ) {
        context.report({
          data: {
            cycle: `${normalizedCurrent} → ${normalizedCurrent}`,
            importPath,
          },
          messageId: "circularDependency",
          node,
        })
        return
      }

      // Add to dependency graph
      if (!dependencyGraph.has(currentFilePath)) {
        dependencyGraph.set(currentFilePath, new Set())
      }

      dependencyGraph.get(currentFilePath).add(normalizedResolved)

      // Check for circular dependency
      const cycle = detectCycle(dependencyGraph, normalizedResolved)

      if (cycle && cycle.includes(currentFilePath)) {
        // Found a cycle that includes the current file
        const cycleIndex = cycle.indexOf(currentFilePath)
        const relevantCycle = cycle
          .slice(cycleIndex)
          .concat(cycle.slice(0, cycleIndex + 1))

        context.report({
          data: {
            cycle: formatCyclePath(relevantCycle),
            importPath,
          },
          messageId: "circularDependency",
          node,
        })
      }
    }

    function checkImport(importPath, node, declarationNode) {
      // Skip type-only imports
      if (isTypeOnlyImport(declarationNode)) {
        return
      }

      // Only check path alias imports
      if (resolvePathAlias(importPath, tsconfigDir, paths)) {
        addDependency(importPath, node)
      }
    }

    return {
      ExportAllDeclaration(node) {
        if (node.source) {
          checkImport(String(node.source.value), node.source, node)
        }
      },
      ExportNamedDeclaration(node) {
        if (node.source) {
          checkImport(String(node.source.value), node.source, node)
        }
      },
      ImportDeclaration(node) {
        checkImport(String(node.source.value), node.source, node)
      },
      ImportExpression(node) {
        if (node.source.type === "Literal") {
          checkImport(String(node.source.value), node.source, node)
        }
      },
    }
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        "Prevents circular dependencies when using TypeScript path aliases",
    },
    messages: {
      circularDependency:
        'Import "{{importPath}}" creates a circular dependency: {{cycle}}',
    },
    schema: [],
    type: "problem",
  },
  name: "no-circular-path-alias",
})
