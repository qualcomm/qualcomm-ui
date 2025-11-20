// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import {createHash} from "node:crypto"
import {existsSync} from "node:fs"
import {readFile} from "node:fs/promises"
import {dirname, join, relative, resolve, sep} from "node:path"
import * as ts from "typescript"

import {pascalCase} from "@qualcomm-ui/utils/change-case"

import {LOG_PREFIX, NODE_BUILTINS, REACT_IMPORTS} from "./demo-plugin-constants"

interface PathAlias {
  pattern: RegExp
  replacement: string
}

export interface ImportSpecifier {
  source: string
  specifiers: Array<{
    imported: string
    local: string
  }>
  type: "thirdParty"
}

export interface RelativeImport {
  resolvedPath: string
  source: string
  specifiers: Array<{
    imported: string
    local: string
  }>
  type: "relative"
}

/**
 * Demo names are created using the PascalCase format of the file name without the
 * extension.
 */
export function createDemoName(filePath: string): string {
  const separatorChar = filePath.includes("/") ? "/" : "\\"
  const fileName = filePath.substring(
    filePath.lastIndexOf(separatorChar),
    filePath.lastIndexOf("."),
  )
  if (!fileName) {
    throw new Error(`Failed to create demo name for ${filePath}`)
  }
  return pascalCase(fileName)
}

export async function extractFileImports(filePath: string): Promise<{
  relativeImports: RelativeImport[]
  thirdPartyImports: ImportSpecifier[]
} | null> {
  try {
    const content = await readFile(filePath, "utf-8")
    return extractImports(content, filePath)
  } catch (error) {
    console.log(
      `${chalk.magenta.bold(LOG_PREFIX)} ${chalk.yellowBright("Failed to parse")} ${chalk.blueBright.bold(filePath)}:`,
      error,
    )
    return null
  }
}

function mergeImports(
  importMap: Map<string, Set<{imported: string; local: string}>>,
  imports: ImportSpecifier[],
) {
  for (const {source, specifiers} of imports) {
    if (isNodeBuiltin(source)) {
      continue
    }
    let sourceSpecifiers = importMap.get(source)
    if (!sourceSpecifiers) {
      sourceSpecifiers = new Set()
      importMap.set(source, sourceSpecifiers)
    }
    for (const spec of specifiers) {
      sourceSpecifiers.add(spec)
    }
  }
}

function extractImports(
  code: string,
  fileName: string,
): {
  relativeImports: RelativeImport[]
  thirdPartyImports: ImportSpecifier[]
} {
  const sourceFile = ts.createSourceFile(
    fileName,
    code,
    ts.ScriptTarget.Latest,
    true,
    getScriptKind(fileName),
  )
  const thirdPartyImports: ImportSpecifier[] = []
  const relativeImports: RelativeImport[] = []

  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node)) {
      const importSpec = parseImportDeclaration(node, fileName)
      if (importSpec) {
        if (importSpec.type === "relative") {
          relativeImports.push(importSpec)
        } else {
          thirdPartyImports.push(importSpec)
        }
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return {relativeImports, thirdPartyImports}
}

export function getScriptKind(fileName: string): ts.ScriptKind {
  return fileName.endsWith(".tsx") || fileName.endsWith(".jsx")
    ? ts.ScriptKind.TSX
    : ts.ScriptKind.TS
}

function parseImportDeclaration(
  node: ts.ImportDeclaration,
  fileName: string,
): ImportSpecifier | RelativeImport | null {
  const moduleSpecifier = node.moduleSpecifier
  if (!ts.isStringLiteral(moduleSpecifier)) {
    return null
  }

  const source = moduleSpecifier.text
  if (node.importClause?.isTypeOnly) {
    return null
  }

  const specifiers = extractSpecifiers(node.importClause)
  if (specifiers.length === 0) {
    return null
  }

  if (isRelativeImport(source)) {
    const resolvedPath = resolveRelativeImport(source, fileName)
    return {
      resolvedPath,
      source,
      specifiers,
      type: "relative",
    }
  }

  if (isNodeBuiltin(source)) {
    return null
  }

  const pathAliases = loadTsConfigPaths(fileName)
  if (isPathAliasImport(source, pathAliases)) {
    const resolvedPath = resolvePathAlias(source, pathAliases)
    if (resolvedPath) {
      return {
        resolvedPath,
        source,
        specifiers,
        type: "relative",
      }
    }
  }

  return {
    source,
    specifiers,
    type: "thirdParty",
  }
}

function extractSpecifiers(
  importClause: ts.ImportClause | undefined,
): Array<{imported: string; local: string}> {
  if (!importClause) {
    return []
  }

  const specifiers: Array<{imported: string; local: string}> = []

  if (importClause.name) {
    specifiers.push({imported: "default", local: "default"})
  }

  if (importClause.namedBindings) {
    if (ts.isNamespaceImport(importClause.namedBindings)) {
      specifiers.push({imported: "*", local: "*"})
    } else if (ts.isNamedImports(importClause.namedBindings)) {
      importClause.namedBindings.elements.forEach((element) => {
        if (!element.isTypeOnly) {
          const imported = element.propertyName
            ? element.propertyName.text
            : element.name.text
          const local = element.name.text
          specifiers.push({imported, local})
        }
      })
    }
  }

  return specifiers
}

function resolveRelativeImport(source: string, fromFile: string): string {
  const fromDir = dirname(fromFile)
  const resolved = resolve(fromDir, source)

  const extensions = [".ts", ".tsx", ".js", ".jsx"]
  for (const ext of extensions) {
    const withExt = resolved + ext
    if (existsSync(withExt)) {
      return withExt
    }
  }

  for (const ext of extensions) {
    const indexFile = join(resolved, `index${ext}`)
    if (existsSync(indexFile)) {
      return indexFile
    }
  }

  return resolved
}

export async function extractAllImports(files: string[]): Promise<{
  importMap: Map<string, Set<{imported: string; local: string}>>
  relativeImports: RelativeImport[]
}> {
  const importMap = new Map<string, Set<{imported: string; local: string}>>()
  const relativeImports: RelativeImport[] = []

  for (const filePath of files) {
    const result = await extractFileImports(filePath)
    if (result) {
      mergeImports(importMap, result.thirdPartyImports)
      relativeImports.push(...result.relativeImports)
    }
  }

  return {importMap, relativeImports}
}

function isRelativeImport(source: string): boolean {
  return source.startsWith("./") || source.startsWith("../")
}

function isNodeBuiltin(source: string): boolean {
  return source.startsWith("node:") || NODE_BUILTINS.includes(source)
}

function loadTsConfigPaths(fromFile: string): PathAlias[] {
  let currentDir = dirname(fromFile)
  const pathAliases: PathAlias[] = []

  while (currentDir !== dirname(currentDir)) {
    const tsconfigPath = join(currentDir, "tsconfig.json")
    if (existsSync(tsconfigPath)) {
      try {
        const configContent = ts.sys.readFile(tsconfigPath)
        if (!configContent) {
          currentDir = dirname(currentDir)
          continue
        }

        const parseResult = ts.parseConfigFileTextToJson(
          tsconfigPath,
          configContent,
        )
        if (parseResult.error) {
          currentDir = dirname(currentDir)
          continue
        }

        const paths = parseResult.config?.compilerOptions?.paths
        const baseUrl = parseResult.config?.compilerOptions?.baseUrl || "./"
        const resolvedBaseUrl = resolve(currentDir, baseUrl)

        if (paths) {
          for (const [alias, targets] of Object.entries(paths)) {
            if (Array.isArray(targets) && targets.length > 0) {
              const target = targets[0]
              const pattern = new RegExp(
                `^${alias
                  .replace("*", "(.*)")
                  .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
                  .replace("\\(\\*\\)", "(.*)")}$`,
              )
              const replacement = resolve(
                resolvedBaseUrl,
                target.replace("*", "$1"),
              )
              pathAliases.push({pattern, replacement})
            }
          }
        }

        const extendsPath = parseResult.config?.extends
        if (extendsPath) {
          const resolvedExtends = resolve(currentDir, extendsPath)
          const extendedAliases = loadTsConfigPathsFromFile(resolvedExtends)
          pathAliases.push(...extendedAliases)
        }

        return pathAliases
      } catch (error) {
        currentDir = dirname(currentDir)
        continue
      }
    }
    currentDir = dirname(currentDir)
  }

  return pathAliases
}

function loadTsConfigPathsFromFile(tsconfigPath: string): PathAlias[] {
  const pathAliases: PathAlias[] = []
  const configDir = dirname(tsconfigPath)

  try {
    const configContent = ts.sys.readFile(tsconfigPath)
    if (!configContent) {
      return pathAliases
    }

    const parseResult = ts.parseConfigFileTextToJson(
      tsconfigPath,
      configContent,
    )
    if (parseResult.error) {
      return pathAliases
    }

    const paths = parseResult.config?.compilerOptions?.paths
    const baseUrl = parseResult.config?.compilerOptions?.baseUrl || "./"
    const resolvedBaseUrl = resolve(configDir, baseUrl)

    if (paths) {
      for (const [alias, targets] of Object.entries(paths)) {
        if (Array.isArray(targets) && targets.length > 0) {
          const target = targets[0]
          const pattern = new RegExp(
            `^${alias
              .replace("*", "(.*)")
              .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
              .replace("\\(\\*\\)", "(.*)")}$`,
          )
          const replacement = resolve(
            resolvedBaseUrl,
            target.replace("*", "$1"),
          )
          pathAliases.push({pattern, replacement})
        }
      }
    }

    const extendsPath = parseResult.config?.extends
    if (extendsPath) {
      let resolvedExtends = resolve(configDir, extendsPath)
      if (!resolvedExtends.endsWith(".json")) {
        resolvedExtends += ".json"
      }
      if (existsSync(resolvedExtends)) {
        const extendedAliases = loadTsConfigPathsFromFile(resolvedExtends)
        pathAliases.push(...extendedAliases)
      }
    }
  } catch (error) {
    return pathAliases
  }

  return pathAliases
}

function isPathAliasImport(source: string, pathAliases: PathAlias[]): boolean {
  return pathAliases.some((alias) => alias.pattern.test(source))
}

function resolvePathAlias(
  source: string,
  pathAliases: PathAlias[],
): string | null {
  for (const alias of pathAliases) {
    if (alias.pattern.test(source)) {
      const resolvedPath = source.replace(alias.pattern, alias.replacement)
      const extensions = [".ts", ".tsx", ".js", ".jsx"]

      for (const ext of extensions) {
        const withExt = resolvedPath + ext
        if (existsSync(withExt)) {
          return withExt
        }
      }

      for (const ext of extensions) {
        const indexFile = join(resolvedPath, `index${ext}`)
        if (existsSync(indexFile)) {
          return indexFile
        }
      }

      return resolvedPath
    }
  }
  return null
}

export function sanitizeSourceName(source: string): string {
  return source
    .replace(/@/g, "at_")
    .replace(/\//g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
}

export function sanitizeIdentifier(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, "_")
}

export function createUniqueModuleName(source: string): string {
  const hash = createHash("sha256").update(source).digest("hex").substring(0, 8)
  const baseName =
    source
      .split("/")
      .pop()
      ?.replace(/[^a-zA-Z0-9]/g, "_")
      ?.replace(/^_+|_+$/g, "")
      ?.replace(/^(\d)/, "_$1") || "module"

  return `mod_${baseName}_${hash}`
}

export function addReactImports(imports: string[], scopeEntries: string[]) {
  imports.push(`import React from "react"`)
  imports.push(`import {
    ${REACT_IMPORTS.join(", ")}
  } from "react"`)
  scopeEntries.push("React", ...REACT_IMPORTS)
}

export function addThirdPartyImports(
  importMap: Map<string, Set<{imported: string; local: string}>>,
  imports: string[],
  scopeEntries: string[],
) {
  const sortedImports = Array.from(importMap.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  )
  const usedNames = new Set(["React", ...REACT_IMPORTS])

  for (const [source, specifiers] of sortedImports) {
    const moduleName = createUniqueModuleName(source)
    imports.push(`import * as ${moduleName} from "${source}"`)
    addModuleToScope(source, specifiers, moduleName, scopeEntries, usedNames)
  }
}

export function addThirdPartyImportsNamespaced(
  importMap: Map<string, Set<{imported: string; local: string}>>,
  imports: string[],
  scopeEntries: string[],
  demoName: string,
) {
  const sortedImports = Array.from(importMap.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  )
  const usedNames = new Set(["React", ...REACT_IMPORTS])

  for (const [source, specifiers] of sortedImports) {
    const moduleName = `${sanitizeIdentifier(demoName)}_${createUniqueModuleName(source)}`
    imports.push(`import * as ${moduleName} from "${source}"`)
    addModuleToScope(source, specifiers, moduleName, scopeEntries, usedNames)
  }
}

export function addRelativeImportsNamespaced(
  relativeImports: RelativeImport[],
  imports: string[],
  scopeEntries: string[],
  demoName: string,
) {
  const processedPaths = new Set<string>()

  for (const {resolvedPath, specifiers} of relativeImports) {
    if (processedPaths.has(resolvedPath)) {
      continue
    }
    processedPaths.add(resolvedPath)

    const moduleName = `${sanitizeIdentifier(demoName)}_${createUniqueModuleName(resolvedPath)}`
    imports.push(`import * as ${moduleName} from "${resolvedPath}"`)

    for (const {imported, local} of specifiers) {
      if (imported === "default") {
        scopeEntries.push(`${local}: ${moduleName}.default`)
      } else if (imported === "*") {
        scopeEntries.push(`...${moduleName}`)
      } else {
        scopeEntries.push(`${local}: ${moduleName}.${imported}`)
      }
    }
  }
}

function addModuleToScope(
  source: string,
  specifiers: Set<{imported: string; local: string}>,
  moduleName: string,
  scopeEntries: string[],
  usedNames: Set<string>,
) {
  const specArray = Array.from(specifiers)
  const hasDefault = specArray.some((spec) => spec.imported === "default")
  const hasNamespace = specArray.some((spec) => spec.imported === "*")
  const namedImports = specArray.filter(
    (spec) => spec.imported !== "default" && spec.imported !== "*",
  )

  if (hasNamespace) {
    scopeEntries.push(`...${moduleName}`)
    return
  }

  const sanitizedSource = sanitizeSourceName(source)
  if (hasDefault) {
    scopeEntries.push(`"${sanitizedSource}__default": ${moduleName}.default`)
  }

  for (const {imported, local} of namedImports) {
    const sanitizedKey = `${sanitizedSource}__${imported}`
    scopeEntries.push(`"${sanitizedKey}": ${moduleName}.${imported}`)
    if (!usedNames.has(local)) {
      scopeEntries.push(`${local}: ${moduleName}.${imported}`)
      usedNames.add(local)
    }
  }
}

export function extractPageId(filePath: string, routesDir: string): string {
  const relativePath = relative(routesDir, filePath)
  const pathParts = relativePath.split(sep)
  if (pathParts.includes("demos")) {
    const demosIndex = pathParts.indexOf("demos")
    return pathParts.slice(0, demosIndex).join(sep)
  }
  return dirname(relativePath)
}

export function isCssAsset(filePath: string) {
  return filePath.endsWith(".css")
}

export function isDemoFile(filePath: string): boolean {
  try {
    return filePath.includes("/demos/") && filePath.endsWith(".tsx")
  } catch (error) {
    return false
  }
}

export function createEmptyScopeModule(): string {
  return "export const createDemoScope = () => ({})"
}
