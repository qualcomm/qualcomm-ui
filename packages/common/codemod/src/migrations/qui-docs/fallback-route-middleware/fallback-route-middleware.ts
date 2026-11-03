// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {glob} from "glob"
import {readFileSync, writeFileSync} from "node:fs"
import {type ImportDeclaration, Node, Project, type SourceFile} from "ts-morph"

import type {
  Codemod,
  CodemodFileResult,
  CodemodFileStatus,
} from "../../types.js"

const LOADER_MODULE = "@qualcomm-ui/react-router-utils/node"
const LOADER_IMPORT = "createFallbackRouteLoader"
const MIDDLEWARE_IMPORT = "createFallbackRouteMiddleware"
const ARGS_TYPE = "FallbackRouteArgs"
const ARGS_NAME = "fallbackRouteArgs"

const MAX_LINE_LENGTH = 80

export interface FallbackRouteMiddlewareResult {
  content: string
  /** Why the file was skipped or must be updated manually. */
  reason?: string
  /**
   * - `updated`: the middleware export was added.
   * - `unchanged`: the file already exports the fallback route middleware.
   * - `skipped`: the file doesn't import `createFallbackRouteLoader`.
   * - `conflict`: the file must be updated manually, see `reason`.
   */
  status: CodemodFileStatus
}

interface Edit {
  end: number
  start: number
  text: string
}

function parse(content: string, filePath: string): SourceFile {
  return new Project({useInMemoryFileSystem: true}).createSourceFile(
    filePath,
    content,
    {overwrite: true},
  )
}

function applyEdits(content: string, edits: Edit[]): string {
  return [...edits]
    .sort((a, b) => b.start - a.start)
    .reduce(
      (result, {end, start, text}) =>
        `${result.slice(0, start)}${text}${result.slice(end)}`,
      content,
    )
}

function formatNamedImport(specifiers: string[], moduleName: string): string {
  const singleLine = `import {${specifiers.join(", ")}} from "${moduleName}"`
  if (singleLine.length <= MAX_LINE_LENGTH) {
    return singleLine
  }
  return `import {\n${specifiers.map((s) => `  ${s},`).join("\n")}\n} from "${moduleName}"`
}

function findLoaderImport(
  sourceFile: SourceFile,
): ImportDeclaration | undefined {
  return sourceFile
    .getImportDeclarations()
    .find(
      (decl) =>
        decl.getModuleSpecifierValue() === LOADER_MODULE &&
        decl.getNamedImports().some((s) => s.getName() === LOADER_IMPORT),
    )
}

/**
 * Returns the local name of a named import from the loader module, or
 * undefined if it isn't imported.
 */
function getImportLocalName(
  sourceFile: SourceFile,
  name: string,
): string | undefined {
  for (const decl of sourceFile.getImportDeclarations()) {
    if (decl.getModuleSpecifierValue() !== LOADER_MODULE) {
      continue
    }
    const specifier = decl.getNamedImports().find((s) => s.getName() === name)
    if (specifier) {
      return specifier.getAliasNode()?.getText() ?? name
    }
  }
  return undefined
}

/**
 * Adds specifiers to the import that brings in `createFallbackRouteLoader`.
 * Each new specifier is placed before the first existing one that sorts after
 * it, so existing specifiers keep their order.
 */
function addSpecifiers(decl: ImportDeclaration, specifiers: string[]): Edit {
  if (decl.getDefaultImport()) {
    return {
      end: decl.getEnd(),
      start: decl.getEnd(),
      text: `\n${formatNamedImport(specifiers, LOADER_MODULE)}`,
    }
  }

  const sortKey = (specifier: string) =>
    specifier.replace(/^type\s+/, "").toLowerCase()
  const result = decl.getNamedImports().map((s) => s.getText())
  for (const specifier of specifiers) {
    const index = result.findIndex(
      (existing) => sortKey(existing) > sortKey(specifier),
    )
    result.splice(index === -1 ? result.length : index, 0, specifier)
  }

  return {
    end: decl.getEnd(),
    start: decl.getStart(),
    text: formatNamedImport(result, LOADER_MODULE),
  }
}

/**
 * Adds `export const middleware = [createFallbackRouteMiddleware(...)]` to a
 * React Router fallback route (`$.tsx`) that uses `createFallbackRouteLoader`.
 * A route with a default export renders as a document, so export files (.md,
 * pages.json, sections.json) must be served from middleware instead of the
 * loader. Inline loader arguments are moved to a shared `fallbackRouteArgs`
 * constant.
 */
export function transformFallbackRouteMiddleware(
  content: string,
  filePath = "$.tsx",
): FallbackRouteMiddlewareResult {
  const sourceFile = parse(content, filePath)

  const loaderImport = findLoaderImport(sourceFile)
  if (!loaderImport) {
    return {
      content,
      reason: `doesn't use ${LOADER_IMPORT}`,
      status: "skipped",
    }
  }

  const middlewareName = getImportLocalName(sourceFile, MIDDLEWARE_IMPORT)
  const existingMiddleware = sourceFile
    .getExportedDeclarations()
    .get("middleware")
  if (existingMiddleware) {
    if (
      middlewareName &&
      existingMiddleware.some((decl) =>
        decl.getText().includes(`${middlewareName}(`),
      )
    ) {
      return {content, status: "unchanged"}
    }
    return {
      content,
      reason: `add ${MIDDLEWARE_IMPORT}(...) to the existing middleware export`,
      status: "conflict",
    }
  }

  const loaderName = getImportLocalName(sourceFile, LOADER_IMPORT)!
  const loaderDecl = sourceFile.getVariableDeclaration("loader")
  const loaderStatement = loaderDecl?.getVariableStatement()
  const loaderCall = loaderDecl?.getInitializer()
  const manualReason = `export const middleware = [${MIDDLEWARE_IMPORT}(...)] with the arguments passed to ${LOADER_IMPORT}`
  if (
    !loaderDecl ||
    !loaderStatement?.isExported() ||
    !Node.isCallExpression(loaderCall) ||
    loaderCall.getExpression().getText() !== loaderName ||
    loaderCall.getArguments().length !== 1
  ) {
    return {content, reason: manualReason, status: "conflict"}
  }

  const arg = loaderCall.getArguments()[0]
  const extractArgs = !Node.isIdentifier(arg)
  if (
    extractArgs &&
    (sourceFile.getVariableDeclaration(ARGS_NAME) ||
      sourceFile.getFunction(ARGS_NAME))
  ) {
    return {content, reason: manualReason, status: "conflict"}
  }

  const newSpecifiers: string[] = []
  if (!middlewareName) {
    newSpecifiers.push(MIDDLEWARE_IMPORT)
  }
  const argsTypeName = getImportLocalName(sourceFile, ARGS_TYPE)
  if (extractArgs && !argsTypeName) {
    newSpecifiers.push(`type ${ARGS_TYPE}`)
  }

  const argsRef = extractArgs ? ARGS_NAME : arg.getText()
  const declarations = [
    extractArgs
      ? `const ${ARGS_NAME}: ${argsTypeName ?? ARGS_TYPE} = ${arg.getText()}\n\n`
      : "",
    `export const middleware = [${middlewareName ?? MIDDLEWARE_IMPORT}(${argsRef})]\n\n`,
  ].join("")

  const statementStart = loaderStatement.getStart(true)
  const edits: Edit[] = [
    {end: statementStart, start: statementStart, text: declarations},
  ]
  if (extractArgs) {
    edits.push({end: arg.getEnd(), start: arg.getStart(), text: ARGS_NAME})
  }
  if (newSpecifiers.length) {
    edits.push(addSpecifiers(loaderImport, newSpecifiers))
  }

  return {content: applyEdits(content, edits), status: "updated"}
}

function describeResult(
  {reason, status}: FallbackRouteMiddlewareResult,
  dryRun: boolean,
): string {
  switch (status) {
    case "updated":
      return dryRun
        ? "would add the fallback route middleware"
        : "added the fallback route middleware"
    case "unchanged":
      return "skipped, already exports the fallback route middleware"
    case "skipped":
      return `${reason}, ignored`
    case "conflict":
      return `update manually: ${reason}`
  }
}

export const fallbackRouteMiddleware: Codemod<"@qualcomm-ui/react-router-utils"> =
  {
    name: "fallback-route-middleware",
    noMatchMessage: `no $.tsx route using ${LOADER_IMPORT} found, nothing to change`,
    run: async ({cwd, dryRun}) => {
      const files = await glob("**/$.tsx", {
        absolute: true,
        cwd,
        ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
        nodir: true,
      })

      return files.sort().map((file): CodemodFileResult => {
        const result = transformFallbackRouteMiddleware(
          readFileSync(file, "utf-8"),
          file,
        )
        if (result.status === "updated" && !dryRun) {
          writeFileSync(file, result.content, "utf-8")
        }
        return {
          file,
          message: describeResult(result, dryRun),
          status: result.status,
        }
      })
    },
    title: "Serve export files from the fallback route middleware ($.tsx)",
    versions: {
      "@qualcomm-ui/react-router-utils": {from: 3, to: 3},
    },
  }
