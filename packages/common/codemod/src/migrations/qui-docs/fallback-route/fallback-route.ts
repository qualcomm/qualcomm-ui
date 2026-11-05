// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {glob} from "glob"
import {access, mkdir, readFile, writeFile} from "node:fs/promises"
import {dirname, join, resolve} from "node:path"
import {
  type Expression,
  type ImportDeclaration,
  Node,
  type ObjectLiteralExpression,
  Project,
  type SourceFile,
  SyntaxKind,
} from "ts-morph"

import type {
  Codemod,
  CodemodFileResult,
  CodemodFileStatus,
} from "../../types.js"

const CONFIG_GLOB = "**/qui-docs.config.{ts,mts,cts,js,mjs,cjs}"
const ROUTE_FILE = "$.tsx"

const LOADER_MODULE = "@qualcomm-ui/react-router-utils/node"
const LOADER_IMPORT = "createFallbackRouteLoader"
const MIDDLEWARE_IMPORT = "createFallbackRouteMiddleware"
const ARGS_NAME = "fallbackRouteArgs"
const MARKDOWN_MODULE = "@qualcomm-ui/docs-plugin/markdown-content"
const SITE_DATA_MODULE = "@qualcomm-ui/mdx-vite-plugin"

const MAX_LINE_LENGTH = 80

export interface RouteDirectories {
  /** @default "app" */
  appDirectory: string
  /** @default "routes" */
  pageDirectory: string
}

export interface FallbackRouteResult {
  content: string
  /** Why the file must be updated manually. */
  reason?: string
  /**
   * - `updated`: the loader export was added.
   * - `unchanged`: the file already exports the fallback route loader.
   * - `conflict`: the file must be updated manually, see `reason`.
   */
  status: Extract<CodemodFileStatus, "updated" | "unchanged" | "conflict">
}

interface RequiredImport {
  module: string
  name: string
}

interface LoaderArgs {
  imports: RequiredImport[]
  text: string
}

function parse(content: string, filePath: string): SourceFile {
  return new Project({useInMemoryFileSystem: true}).createSourceFile(
    filePath,
    content,
    {overwrite: true},
  )
}

/**
 * Follows the default export to the config object. Handles `satisfies` and
 * `as` expressions, wrapper calls like `defineConfig({...})`, and identifiers
 * that reference a variable in the same file.
 */
function resolveConfigObject(
  sourceFile: SourceFile,
  expression: Expression | undefined,
): ObjectLiteralExpression | undefined {
  let node: Node | undefined = expression
  const visited = new Set<Node>()
  while (node && !visited.has(node)) {
    visited.add(node)
    if (Node.isObjectLiteralExpression(node)) {
      return node
    }
    if (
      Node.isSatisfiesExpression(node) ||
      Node.isAsExpression(node) ||
      Node.isParenthesizedExpression(node)
    ) {
      node = node.getExpression()
    } else if (Node.isCallExpression(node)) {
      node = node.getArguments()[0]
    } else if (Node.isIdentifier(node)) {
      node = sourceFile.getVariableDeclaration(node.getText())?.getInitializer()
    } else {
      return undefined
    }
  }
  return undefined
}

/**
 * Reads a string property from the config object. Returns `fallback` when the
 * property is omitted, or undefined when its value can't be determined
 * statically.
 */
function readStringProperty(
  config: ObjectLiteralExpression,
  name: string,
  fallback: string,
): string | undefined {
  const property = config.getProperty(name)
  if (!property) {
    return config.getProperties().some(Node.isSpreadAssignment)
      ? undefined
      : fallback
  }
  const initializer = Node.isPropertyAssignment(property)
    ? property.getInitializer()
    : undefined
  return Node.isStringLiteral(initializer) ||
    Node.isNoSubstitutionTemplateLiteral(initializer)
    ? initializer.getLiteralValue()
    : undefined
}

/**
 * Reads `appDirectory` and `pageDirectory` from a qui-docs config file, falling
 * back to their defaults when omitted. Returns undefined when the config
 * object or either value can't be determined statically.
 */
export function resolveRouteDirectories(
  content: string,
  filePath = "qui-docs.config.ts",
): RouteDirectories | undefined {
  const sourceFile = parse(content, filePath)
  const exportAssignment = sourceFile.getExportAssignment(
    (decl) => !decl.isExportEquals(),
  )
  const config = resolveConfigObject(
    sourceFile,
    exportAssignment?.getExpression(),
  )
  if (!config) {
    return undefined
  }
  const appDirectory = readStringProperty(config, "appDirectory", "app")
  const pageDirectory = readStringProperty(config, "pageDirectory", "routes")
  return appDirectory !== undefined && pageDirectory !== undefined
    ? {appDirectory, pageDirectory}
    : undefined
}

function insertAt(content: string, pos: number, text: string): string {
  return `${content.slice(0, pos)}${text}${content.slice(pos)}`
}

function formatNamedImport(specifiers: string[], moduleName: string): string {
  const singleLine = `import {${specifiers.join(", ")}} from "${moduleName}"`
  if (singleLine.length <= MAX_LINE_LENGTH) {
    return singleLine
  }
  return `import {\n${specifiers.map((s) => `  ${s},`).join("\n")}\n} from "${moduleName}"`
}

/**
 * Returns the local name of a named import, or undefined if it isn't imported.
 */
function getImportLocalName(
  sourceFile: SourceFile,
  {module, name}: RequiredImport,
): string | undefined {
  for (const decl of sourceFile.getImportDeclarations()) {
    if (decl.getModuleSpecifierValue() !== module) {
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
 * Whether a top-level import or declaration already uses `name`.
 */
function hasBinding(sourceFile: SourceFile, name: string): boolean {
  const imported = sourceFile
    .getImportDeclarations()
    .some(
      (decl) =>
        decl.getDefaultImport()?.getText() === name ||
        decl.getNamespaceImport()?.getText() === name ||
        decl
          .getNamedImports()
          .some(
            (s) => (s.getAliasNode() ?? s.getNameNode()).getText() === name,
          ),
    )
  return (
    imported ||
    !!sourceFile.getVariableDeclaration(name) ||
    !!sourceFile.getFunction(name) ||
    !!sourceFile.getClass(name)
  )
}

/**
 * Adds a named import, merging it into an existing import of the module when
 * possible. New import declarations are kept sorted by module specifier.
 */
function addImport(
  sourceFile: SourceFile,
  content: string,
  {module, name}: RequiredImport,
): string {
  const imports = sourceFile.getImportDeclarations()
  const existing = imports.find(
    (decl: ImportDeclaration) =>
      decl.getModuleSpecifierValue() === module &&
      !decl.isTypeOnly() &&
      !decl.getDefaultImport() &&
      !decl.getNamespaceImport(),
  )

  if (existing) {
    const sortKey = (specifier: string) =>
      specifier.replace(/^type\s+/, "").toLowerCase()
    const specifiers = existing.getNamedImports().map((s) => s.getText())
    const index = specifiers.findIndex(
      (specifier) => sortKey(specifier) > sortKey(name),
    )
    specifiers.splice(index === -1 ? specifiers.length : index, 0, name)
    return `${content.slice(0, existing.getStart())}${formatNamedImport(specifiers, module)}${content.slice(existing.getEnd())}`
  }

  const statement = `import {${name}} from "${module}"`
  const next = imports.find((decl) => decl.getModuleSpecifierValue() > module)
  if (next) {
    return insertAt(content, next.getStart(), `${statement}\n`)
  }
  const last = imports[imports.length - 1]
  if (last) {
    return insertAt(content, last.getEnd(), `\n${statement}`)
  }
  return `${statement}\n\n${content}`
}

/**
 * Finds the `createFallbackRouteMiddleware(...)` call in the middleware export.
 */
function findMiddlewareCall(sourceFile: SourceFile) {
  const middlewareName = getImportLocalName(sourceFile, {
    module: LOADER_MODULE,
    name: MIDDLEWARE_IMPORT,
  })
  if (!middlewareName) {
    return undefined
  }
  return sourceFile
    .getVariableDeclaration("middleware")
    ?.getInitializer()
    ?.getDescendantsOfKind(SyntaxKind.CallExpression)
    .find((call) => call.getExpression().getText() === middlewareName)
}

/**
 * Determines the loader's arguments. Reuses the arguments passed to the
 * fallback route middleware or an existing `fallbackRouteArgs` constant, and
 * otherwise builds them from the docs plugin's virtual modules. Returns
 * undefined when the middleware passes inline arguments or a required import
 * name is already taken.
 */
function resolveLoaderArgs(sourceFile: SourceFile): LoaderArgs | undefined {
  const middlewareCall = findMiddlewareCall(sourceFile)
  if (middlewareCall) {
    const args = middlewareCall.getArguments()
    return args.length === 1 && Node.isIdentifier(args[0])
      ? {imports: [], text: args[0].getText()}
      : undefined
  }
  if (sourceFile.getVariableDeclaration(ARGS_NAME)) {
    return {imports: [], text: ARGS_NAME}
  }

  const required: RequiredImport[] = [
    {module: MARKDOWN_MODULE, name: "getPages"},
    {module: MARKDOWN_MODULE, name: "getSections"},
    {module: SITE_DATA_MODULE, name: "siteData"},
  ]
  const imports: RequiredImport[] = []
  const names = new Map<string, string>()
  for (const entry of required) {
    const local = getImportLocalName(sourceFile, entry)
    if (!local && hasBinding(sourceFile, entry.name)) {
      return undefined
    }
    if (!local) {
      imports.push(entry)
    }
    names.set(entry.name, local ?? entry.name)
  }

  const property = (name: string) => {
    const local = names.get(name)!
    return local === name ? name : `${name}: ${local}`
  }
  return {
    imports,
    text: `{\n  exports: ${names.get("siteData")}.exports,\n  ${property("getPages")},\n  ${property("getSections")},\n}`,
  }
}

/**
 * Adds `export const loader = createFallbackRouteLoader(...)` to a React Router
 * fallback route (`$.tsx`) that doesn't export a loader. The loader is placed
 * after the fallback route middleware when there is one, and after the imports
 * otherwise. Pass an empty string to generate a new fallback route.
 */
export function transformFallbackRoute(
  content: string,
  filePath = "$.tsx",
): FallbackRouteResult {
  let sourceFile = parse(content, filePath)
  const loaderImport: RequiredImport = {
    module: LOADER_MODULE,
    name: LOADER_IMPORT,
  }
  const loaderName = getImportLocalName(sourceFile, loaderImport)

  const exportedLoader = sourceFile.getExportedDeclarations().get("loader")
  if (exportedLoader) {
    if (
      loaderName &&
      exportedLoader.some((decl) => decl.getText().includes(`${loaderName}(`))
    ) {
      return {content, status: "unchanged"}
    }
    return {
      content,
      reason: `replace the existing loader with ${LOADER_IMPORT}(...)`,
      status: "conflict",
    }
  }

  const manualReason = `export const loader = ${LOADER_IMPORT}(...) with the arguments passed to ${MIDDLEWARE_IMPORT}`
  if (hasBinding(sourceFile, "loader")) {
    return {content, reason: manualReason, status: "conflict"}
  }
  const args = resolveLoaderArgs(sourceFile)
  if (!args) {
    return {content, reason: manualReason, status: "conflict"}
  }

  let result = content
  for (const entry of loaderName
    ? args.imports
    : [...args.imports, loaderImport]) {
    result = addImport(sourceFile, result, entry)
    sourceFile = parse(result, filePath)
  }

  const imports = sourceFile.getImportDeclarations()
  const anchor =
    sourceFile.getVariableStatement("middleware") ?? imports[imports.length - 1]
  result = insertAt(
    result,
    anchor.getEnd(),
    `\n\nexport const loader = ${loaderName ?? LOADER_IMPORT}(${args.text})`,
  )

  return {content: `${result.trimEnd()}\n`, status: "updated"}
}

async function exists(path: string): Promise<boolean> {
  return access(path).then(
    () => true,
    () => false,
  )
}

function describeResult(
  {reason, status}: FallbackRouteResult,
  created: boolean,
  dryRun: boolean,
): string {
  switch (status) {
    case "updated":
      if (created) {
        return dryRun
          ? "would create the fallback route, the next steps update it once created"
          : "created the fallback route"
      }
      return dryRun
        ? "would add the fallback route loader"
        : "added the fallback route loader"
    case "unchanged":
      return "skipped, already exports the fallback route loader"
    case "conflict":
      return `update manually: ${reason}`
  }
}

async function migrateFallbackRoute(
  cwd: string,
  configFile: string,
  dryRun: boolean,
): Promise<CodemodFileResult> {
  const directories = resolveRouteDirectories(
    await readFile(configFile, "utf-8"),
    configFile,
  )
  if (!directories) {
    return {
      file: configFile,
      message: `update manually: couldn't read appDirectory or pageDirectory, create ${ROUTE_FILE} in the routes directory`,
      status: "conflict",
    }
  }

  // appDirectory is resolved from the project root, not the config file.
  const routesDir = resolve(
    cwd,
    directories.appDirectory,
    directories.pageDirectory,
  )
  const file = join(routesDir, ROUTE_FILE)
  const existing = await exists(file)
  const result = transformFallbackRoute(
    existing ? await readFile(file, "utf-8") : "",
    file,
  )

  if (result.status === "updated" && !dryRun) {
    await mkdir(dirname(file), {recursive: true})
    await writeFile(file, result.content, "utf-8")
  }
  return {
    file,
    message: describeResult(result, !existing, dryRun),
    status: result.status,
  }
}

export const fallbackRoute: Codemod<"@qualcomm-ui/react-router-utils"> = {
  name: "fallback-route",
  noMatchMessage: "no qui-docs config found, nothing to change",
  run: async ({cwd, dryRun}) => {
    const configFiles = await glob(CONFIG_GLOB, {
      absolute: true,
      cwd,
      ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
      nodir: true,
    })

    const results: CodemodFileResult[] = []
    for (const configFile of configFiles.sort()) {
      results.push(await migrateFallbackRoute(cwd, configFile, dryRun))
    }
    return results
  },
  title: `Add the fallback route loader (${ROUTE_FILE})`,
  versions: {
    "@qualcomm-ui/react-router-utils": {from: 2, to: 3},
  },
}
