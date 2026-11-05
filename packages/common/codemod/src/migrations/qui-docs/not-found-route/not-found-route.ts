// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {glob} from "glob"
import {readFileSync, writeFileSync} from "node:fs"
import {Project, type SourceFile} from "ts-morph"

import type {
  Codemod,
  CodemodFileResult,
  CodemodFileStatus,
} from "../../types.js"

const LOADER_MODULE = "@qualcomm-ui/react-router-utils/node"
const LOADER_IMPORT = "createFallbackRouteLoader"
const LOADER_DATA_TYPE = "FallbackRouteLoaderData"
const NOT_FOUND_MODULE = "@qualcomm-ui/react-mdx/not-found"
const NOT_FOUND_IMPORT = "NotFound"

const NOT_FOUND_ROUTE = `export default function NotFoundRoute({
  loaderData,
}: {
  loaderData: ${LOADER_DATA_TYPE}
}) {
  return <NotFound url={loaderData.pathname} />
}
`

export interface NotFoundRouteResult {
  content: string
  /**
   * - `updated`: the file had no default export, and NotFoundRoute was added.
   * - `skipped`: the file doesn't import `createFallbackRouteLoader`.
   * - `unchanged`: the file already has a default export (fallback component).
   */
  status: Extract<CodemodFileStatus, "updated" | "unchanged" | "skipped">
}

function importsFallbackLoader(sourceFile: SourceFile): boolean {
  return sourceFile
    .getImportDeclarations()
    .some(
      (decl) =>
        decl.getModuleSpecifierValue() === LOADER_MODULE &&
        decl
          .getNamedImports()
          .some((specifier) => specifier.getName() === LOADER_IMPORT),
    )
}

const MAX_LINE_LENGTH = 80

function parse(content: string, filePath: string): SourceFile {
  return new Project({useInMemoryFileSystem: true}).createSourceFile(
    filePath,
    content,
    {overwrite: true},
  )
}

function formatNamedImport(specifiers: string[], moduleName: string): string {
  const singleLine = `import {${specifiers.join(", ")}} from "${moduleName}"`
  if (singleLine.length <= MAX_LINE_LENGTH) {
    return singleLine
  }
  return `import {\n${specifiers.map((s) => `  ${s},`).join("\n")}\n} from "${moduleName}"`
}

/**
 * Returns the local name of the FallbackRouteLoaderData import, or undefined if
 * it isn't imported.
 */
function getLoaderDataLocalName(sourceFile: SourceFile): string | undefined {
  for (const decl of sourceFile.getImportDeclarations()) {
    if (decl.getModuleSpecifierValue() !== LOADER_MODULE) {
      continue
    }
    const specifier = decl
      .getNamedImports()
      .find((s) => s.getName() === LOADER_DATA_TYPE)
    if (specifier) {
      return specifier.getAliasNode()?.getText() ?? LOADER_DATA_TYPE
    }
  }
  return undefined
}

/**
 * Adds `type FallbackRouteLoaderData` to the import that brings in
 * `createFallbackRouteLoader`.
 */
function addLoaderDataImport(sourceFile: SourceFile, content: string): string {
  const decl = sourceFile
    .getImportDeclarations()
    .find(
      (d) =>
        d.getModuleSpecifierValue() === LOADER_MODULE &&
        d.getNamedImports().some((s) => s.getName() === LOADER_IMPORT),
    )!

  if (decl.getDefaultImport()) {
    return insertAt(
      content,
      decl.getEnd(),
      `\nimport type {${LOADER_DATA_TYPE}} from "${LOADER_MODULE}"`,
    )
  }

  const specifiers = [
    ...decl.getNamedImports().map((s) => s.getText()),
    `type ${LOADER_DATA_TYPE}`,
  ]
  return `${content.slice(0, decl.getStart())}${formatNamedImport(specifiers, LOADER_MODULE)}${content.slice(decl.getEnd())}`
}

/**
 * Returns the local name of the NotFound import, or undefined if it isn't
 * imported.
 */
function getNotFoundLocalName(sourceFile: SourceFile): string | undefined {
  for (const decl of sourceFile.getImportDeclarations()) {
    if (decl.getModuleSpecifierValue() !== NOT_FOUND_MODULE) {
      continue
    }
    const specifier = decl
      .getNamedImports()
      .find((s) => s.getName() === NOT_FOUND_IMPORT)
    if (specifier) {
      return specifier.getAliasNode()?.getText() ?? NOT_FOUND_IMPORT
    }
  }
  return undefined
}

/**
 * Inserts the NotFound import, keeping import declarations sorted by module
 * specifier.
 */
function addNotFoundImport(sourceFile: SourceFile, content: string): string {
  const existing = sourceFile
    .getImportDeclarations()
    .find(
      (decl) =>
        decl.getModuleSpecifierValue() === NOT_FOUND_MODULE &&
        !decl.isTypeOnly() &&
        !decl.getNamespaceImport(),
    )

  if (existing) {
    const namedImports = existing.getNamedImports()
    if (namedImports.length) {
      const last = namedImports[namedImports.length - 1]
      return insertAt(content, last.getEnd(), `, ${NOT_FOUND_IMPORT}`)
    }
    const defaultImport = existing.getDefaultImport()
    if (defaultImport) {
      return insertAt(
        content,
        defaultImport.getEnd(),
        `, {${NOT_FOUND_IMPORT}}`,
      )
    }
  }

  const statement = `import {${NOT_FOUND_IMPORT}} from "${NOT_FOUND_MODULE}"\n`
  const imports = sourceFile.getImportDeclarations()
  const next = imports.find(
    (decl) => decl.getModuleSpecifierValue() > NOT_FOUND_MODULE,
  )
  if (next) {
    return insertAt(content, next.getStart(), statement)
  }
  const last = imports[imports.length - 1]
  if (last) {
    return insertAt(content, last.getEnd(), `\n${statement.trimEnd()}`)
  }
  return `${statement}\n${content}`
}

function insertAt(content: string, pos: number, text: string): string {
  return `${content.slice(0, pos)}${text}${content.slice(pos)}`
}

/**
 * Adds the NotFound and FallbackRouteLoaderData imports and default `NotFoundRoute`
 * export to a React Router fallback route (`$.tsx`) that uses
 * `createFallbackRouteLoader`. Existing code
 * is left untouched.
 */
export function transformNotFoundRoute(
  content: string,
  filePath = "$.tsx",
): NotFoundRouteResult {
  let sourceFile = parse(content, filePath)

  if (!importsFallbackLoader(sourceFile)) {
    return {content, status: "skipped"}
  }

  // Any existing default export is the app's own fallback component.
  if (sourceFile.getDefaultExportSymbol()) {
    return {content, status: "unchanged"}
  }

  const notFoundName = getNotFoundLocalName(sourceFile)

  let result = content
  if (!notFoundName) {
    result = addNotFoundImport(sourceFile, result)
    sourceFile = parse(result, filePath)
  }
  const loaderDataName = getLoaderDataLocalName(sourceFile)
  if (!loaderDataName) {
    result = addLoaderDataImport(sourceFile, result)
  }

  const route = NOT_FOUND_ROUTE.replace(
    `loaderData: ${LOADER_DATA_TYPE}`,
    () => `loaderData: ${loaderDataName ?? LOADER_DATA_TYPE}`,
  ).replace(
    `<${NOT_FOUND_IMPORT} url=`,
    () => `<${notFoundName ?? NOT_FOUND_IMPORT} url=`,
  )
  result = `${result.trimEnd()}\n\n${route}`

  return {content: result, status: "updated"}
}

function describeResult(
  status: NotFoundRouteResult["status"],
  dryRun: boolean,
): string {
  switch (status) {
    case "updated":
      return dryRun
        ? "would add the 404 fallback component"
        : "added the 404 fallback component"
    case "unchanged":
      return "skipped, already renders a fallback component"
    case "skipped":
      return `doesn't use ${LOADER_IMPORT}, ignored`
  }
}

export const notFoundRoute: Codemod<"@qualcomm-ui/react-router-utils"> = {
  name: "not-found-route",
  noMatchMessage: `no $.tsx route using ${LOADER_IMPORT} found, nothing to change`,
  run: async ({cwd, dryRun}) => {
    const files = await glob("**/$.tsx", {
      absolute: true,
      cwd,
      ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
      nodir: true,
    })

    return files.sort().map((file): CodemodFileResult => {
      const {content, status} = transformNotFoundRoute(
        readFileSync(file, "utf-8"),
        file,
      )
      if (status === "updated" && !dryRun) {
        writeFileSync(file, content, "utf-8")
      }
      return {file, message: describeResult(status, dryRun), status}
    })
  },
  title: "Add 404 fallback component ($.tsx)",
  versions: {
    "@qualcomm-ui/react-router-utils": {from: 2, to: 3},
  },
}
