// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {glob} from "glob"
import {readFileSync, writeFileSync} from "node:fs"
import {
  type ImportDeclaration,
  type ImportSpecifierStructure,
  Node,
  type OptionalKind,
  Project,
  type SourceFile,
  SyntaxKind,
} from "ts-morph"

import type {
  Codemod,
  CodemodFileResult,
  CodemodFileStatus,
} from "../../types.js"

const CONTEXT_MODULE = "@qualcomm-ui/react-mdx/context"
const DOCS_LAYOUT_MODULE = "@qualcomm-ui/react-mdx/docs-layout"

/**
 * Deprecated name to replacement name.
 */
export const DOCS_CONTEXT_RENAMES: Readonly<Record<string, string>> = {
  MdxDocsContextValue: "DocsRuntimeContextValue",
  MdxDocsLayoutContextProvider: "DocsPageProvider",
  MdxDocsLayoutContextState: "DocsPageContextValue",
  MdxDocsProvider: "DocsRuntimeProvider",
  SiteContextProvider: "DocsManifestProvider",
  SiteDataContextValue: "DocsManifestContextValue",
  useMdxDocsContext: "useDocsRuntimeContext",
  useMdxDocsLayoutContext: "useDocsPageContext",
  useSiteContext: "useDocsManifestContext",
}

/**
 * The page context used to be exported from the docs-layout entry. Its
 * replacements are only exported from the context entry.
 */
const DOCS_LAYOUT_NAMES = new Set([
  "MdxDocsLayoutContextProvider",
  "MdxDocsLayoutContextState",
  "useMdxDocsLayoutContext",
])

const PAGE_CONTEXT_NAMES = new Set(
  [...DOCS_LAYOUT_NAMES].map((name) => DOCS_CONTEXT_RENAMES[name]),
)

export interface DocsContextNamesResult {
  content: string
  /** References the codemod can't rewrite safely. */
  manual: string[]
  /** Number of deprecated names replaced. */
  renamed: number
  /**
   * - `updated`: deprecated names were replaced.
   * - `unchanged`: the file imports from the context or docs-layout entries,
   *   but doesn't use a deprecated name.
   * - `skipped`: the file doesn't import from either entry.
   * - `conflict`: some references must be updated manually. Other references
   *   in the file may still have been updated.
   */
  status: CodemodFileStatus
}

interface Edit {
  end: number
  start: number
  text: string
}

function parse(content: string, filePath: string): SourceFile {
  return new Project({
    manipulationSettings: {
      insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: false,
    },
    useInMemoryFileSystem: true,
  }).createSourceFile(filePath, content, {overwrite: true})
}

function isRenamed(name: string): boolean {
  return Object.hasOwn(DOCS_CONTEXT_RENAMES, name)
}

/**
 * Whether `name` is a deprecated export of `module`.
 */
function isDeprecatedExport(module: string, name: string): boolean {
  return module === CONTEXT_MODULE
    ? isRenamed(name)
    : module === DOCS_LAYOUT_MODULE && DOCS_LAYOUT_NAMES.has(name)
}

function getTopLevelBindings(sourceFile: SourceFile): Set<string> {
  const names = new Set<string>()
  for (const decl of sourceFile.getImportDeclarations()) {
    for (const specifier of decl.getNamedImports()) {
      names.add(specifier.getAliasNode()?.getText() ?? specifier.getName())
    }
    const namespace = decl.getNamespaceImport()?.getText()
    if (namespace) {
      names.add(namespace)
    }
    const defaultImport = decl.getDefaultImport()?.getText()
    if (defaultImport) {
      names.add(defaultImport)
    }
  }
  for (const statement of sourceFile.getStatements()) {
    if (Node.isVariableStatement(statement)) {
      for (const declaration of statement.getDeclarations()) {
        names.add(declaration.getName())
      }
    } else if (
      Node.isFunctionDeclaration(statement) ||
      Node.isClassDeclaration(statement) ||
      Node.isInterfaceDeclaration(statement) ||
      Node.isTypeAliasDeclaration(statement) ||
      Node.isEnumDeclaration(statement)
    ) {
      const name = statement.getName()
      if (name) {
        names.add(name)
      }
    }
  }
  return names
}

/**
 * Renames every reference to an import binding. Shorthand properties and local
 * exports keep their original key and exported name, so the file's own API
 * doesn't change.
 */
function renameReferences(
  nameNode: Node,
  oldName: string,
  newName: string,
  edits: Edit[],
): void {
  const sourceFile = nameNode.getSourceFile()
  for (const node of nameNode
    .asKindOrThrow(SyntaxKind.Identifier)
    .findReferencesAsNodes()) {
    if (
      node.getSourceFile() !== sourceFile ||
      node.getFirstAncestorByKind(SyntaxKind.ImportDeclaration)
    ) {
      continue
    }
    const parent = node.getParent()
    let text = newName
    if (Node.isShorthandPropertyAssignment(parent)) {
      text = `${oldName}: ${newName}`
    } else if (Node.isExportSpecifier(parent) && !parent.getAliasNode()) {
      text = `${newName} as ${oldName}`
    }
    edits.push({end: node.getEnd(), start: node.getStart(), text})
  }
}

/**
 * Returns the `ns.Name` property accesses and qualified type names in the file
 * whose namespace is `namespace`.
 */
function getNamespaceMembers(
  sourceFile: SourceFile,
  namespace: string,
): Node[] {
  const members: Node[] = []
  sourceFile.forEachDescendant((node) => {
    if (
      Node.isPropertyAccessExpression(node) &&
      node.getExpression().getText() === namespace
    ) {
      members.push(node.getNameNode())
    } else if (
      Node.isQualifiedName(node) &&
      node.getLeft().getText() === namespace
    ) {
      members.push(node.getRight())
    }
  })
  return members
}

function renameDeprecatedNames(
  sourceFile: SourceFile,
): Omit<DocsContextNamesResult, "status"> {
  const edits: Edit[] = []
  const manual: string[] = []
  const bindings = getTopLevelBindings(sourceFile)
  let renamed = 0

  for (const decl of sourceFile.getImportDeclarations()) {
    const module = decl.getModuleSpecifierValue()
    const namespace = decl.getNamespaceImport()?.getText()

    if (namespace) {
      for (const member of getNamespaceMembers(sourceFile, namespace)) {
        const name = member.getText()
        if (!isDeprecatedExport(module, name)) {
          continue
        }
        if (module === DOCS_LAYOUT_MODULE) {
          manual.push(
            `replace ${namespace}.${name} with ${DOCS_CONTEXT_RENAMES[name]} from "${CONTEXT_MODULE}"`,
          )
        } else {
          edits.push({
            end: member.getEnd(),
            start: member.getStart(),
            text: DOCS_CONTEXT_RENAMES[name],
          })
          renamed++
        }
      }
      continue
    }

    for (const specifier of decl.getNamedImports()) {
      const name = specifier.getName()
      if (!isDeprecatedExport(module, name)) {
        continue
      }
      const newName = DOCS_CONTEXT_RENAMES[name]
      const nameNode = specifier.getNameNode()
      let text = newName
      if (!specifier.getAliasNode()) {
        if (bindings.has(newName)) {
          // The new name is already bound in this file, so keep the old one.
          text = `${newName} as ${name}`
        } else {
          renameReferences(nameNode, name, newName, edits)
        }
      }
      edits.push({end: nameNode.getEnd(), start: nameNode.getStart(), text})
      renamed++
    }
  }

  for (const decl of sourceFile.getExportDeclarations()) {
    const module = decl.getModuleSpecifierValue()
    if (!module) {
      continue
    }
    for (const specifier of decl.getNamedExports()) {
      const name = specifier.getName()
      if (!isDeprecatedExport(module, name)) {
        continue
      }
      const newName = DOCS_CONTEXT_RENAMES[name]
      if (module === DOCS_LAYOUT_MODULE) {
        manual.push(
          `re-export ${newName} from "${CONTEXT_MODULE}" instead of ${name} from "${DOCS_LAYOUT_MODULE}"`,
        )
        continue
      }
      const nameNode = specifier.getNameNode()
      // Keep the exported name so this file's own API doesn't change.
      edits.push({
        end: nameNode.getEnd(),
        start: nameNode.getStart(),
        text: specifier.getAliasNode() ? newName : `${newName} as ${name}`,
      })
      renamed++
    }
  }

  return {
    content: applyEdits(sourceFile.getFullText(), edits),
    manual,
    renamed,
  }
}

function applyEdits(content: string, edits: Edit[]): string {
  let result = content
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    result = `${result.slice(0, edit.start)}${edit.text}${result.slice(edit.end)}`
  }
  return result
}

function printSpecifier(
  {alias, isTypeOnly, name}: OptionalKind<ImportSpecifierStructure>,
  typePrefix: boolean,
): string {
  return `${typePrefix && isTypeOnly ? "type " : ""}${name}${alias ? ` as ${alias}` : ""}`
}

/**
 * Appends specifiers after the last named import, one per line if the import
 * is already split across lines.
 */
function addSpecifiers(
  target: ImportDeclaration,
  specifiers: OptionalKind<ImportSpecifierStructure>[],
): Edit | undefined {
  const named = target.getNamedImports()
  const existing = new Set(
    named.map((s) => `${s.getName()} as ${s.getAliasNode()?.getText()}`),
  )
  const additions = specifiers
    .filter((s) => !existing.has(`${s.name} as ${s.alias}`))
    .map((s) => printSpecifier(s, !target.isTypeOnly()))
  if (!additions.length) {
    return
  }
  const last = named[named.length - 1]
  const indent = target
    .getSourceFile()
    .getFullText()
    .slice(last.getStartLinePos(), last.getStart())
  const separator = /^\s*$/.test(indent) ? `,\n${indent}` : ", "
  return {
    end: last.getEnd(),
    start: last.getEnd(),
    text: `${separator}${additions.join(separator)}`,
  }
}

/**
 * Moves the page context imports from the docs-layout entry to the context
 * entry, which is the only entry that exports the new names. Returns
 * `undefined` if there's nothing to move.
 */
function movePageContextImports(sourceFile: SourceFile): string | undefined {
  const moved: OptionalKind<ImportSpecifierStructure>[] = []
  const emptied: ImportDeclaration[] = []
  let first: ImportDeclaration | undefined

  for (const decl of sourceFile.getImportDeclarations()) {
    if (decl.getModuleSpecifierValue() !== DOCS_LAYOUT_MODULE) {
      continue
    }
    for (const specifier of decl.getNamedImports()) {
      if (!PAGE_CONTEXT_NAMES.has(specifier.getName())) {
        continue
      }
      moved.push({
        alias: specifier.getAliasNode()?.getText(),
        isTypeOnly: specifier.isTypeOnly() || decl.isTypeOnly(),
        name: specifier.getName(),
      })
      first ??= decl
      specifier.remove()
    }
    if (!decl.getNamedImports().length && !decl.getDefaultImport()) {
      emptied.push(decl)
    }
  }

  if (!first) {
    return
  }

  const content = sourceFile.getFullText()
  const edits: Edit[] = []
  const hasValue = moved.some((specifier) => !specifier.isTypeOnly)
  const target = sourceFile
    .getImportDeclarations()
    .find(
      (decl) =>
        decl.getModuleSpecifierValue() === CONTEXT_MODULE &&
        decl.getNamedImports().length > 0 &&
        (!hasValue || !decl.isTypeOnly()),
    )

  let replacement: string | undefined
  if (target) {
    const edit = addSpecifiers(target, moved)
    if (edit) {
      edits.push(edit)
    }
  } else {
    const specifiers = moved.map((s) => printSpecifier(s, hasValue))
    replacement = `import ${hasValue ? "" : "type "}{${specifiers.join(", ")}} from "${CONTEXT_MODULE}"`
    // "context" sorts before "docs-layout", so this keeps sorted imports sorted.
    if (!emptied.includes(first)) {
      const start = first.getStart()
      edits.push({end: start, start, text: `${replacement}\n`})
    }
  }

  for (const decl of emptied) {
    if (decl === first && replacement) {
      edits.push({
        end: decl.getEnd(),
        start: decl.getStart(),
        text: replacement,
      })
    } else {
      // Include the trailing newline so that no blank line is left behind.
      const end = decl.getEnd()
      edits.push({
        end: content[end] === "\n" ? end + 1 : end,
        start: decl.getStart(),
        text: "",
      })
    }
  }

  return applyEdits(content, edits)
}

/**
 * Replaces the deprecated docs context exports of `@qualcomm-ui/react-mdx` with
 * their replacements, and moves page context imports from the docs-layout entry
 * to the context entry. Edited imports aren't reformatted.
 */
export function transformDocsContextNames(
  content: string,
  filePath = "file.tsx",
): DocsContextNamesResult {
  const sourceFile = parse(content, filePath)
  const importsEntry = [
    ...sourceFile.getImportDeclarations(),
    ...sourceFile.getExportDeclarations(),
  ].some((decl) => {
    const module = decl.getModuleSpecifierValue()
    return module === CONTEXT_MODULE || module === DOCS_LAYOUT_MODULE
  })
  if (!importsEntry) {
    return {content, manual: [], renamed: 0, status: "skipped"}
  }

  const result = renameDeprecatedNames(sourceFile)
  if (result.renamed) {
    result.content =
      movePageContextImports(parse(result.content, filePath)) ?? result.content
  }

  const status: CodemodFileStatus = result.manual.length
    ? "conflict"
    : result.renamed
      ? "updated"
      : "unchanged"

  return {...result, status}
}

function describeResult(
  {manual, renamed, status}: DocsContextNamesResult,
  dryRun: boolean,
): string {
  const names = `${renamed} deprecated name${renamed === 1 ? "" : "s"}`
  const verb = dryRun ? "would rename" : "renamed"
  switch (status) {
    case "updated":
      return `${verb} ${names}`
    case "unchanged":
      return "no deprecated context names found"
    case "skipped":
      return "doesn't import from the context or docs-layout entries, ignored"
    case "conflict":
      return `${renamed ? `${verb} ${names}, ` : ""}update manually: ${manual.join("; ")}`
  }
}

export const docsContextNames: Codemod<"@qualcomm-ui/react-mdx"> = {
  name: "docs-context-names",
  noMatchMessage:
    "no imports from @qualcomm-ui/react-mdx/context or @qualcomm-ui/react-mdx/docs-layout found, nothing to change",
  run: async ({cwd, dryRun}) => {
    const files = await glob("**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}", {
      absolute: true,
      cwd,
      ignore: [
        "**/node_modules/**",
        "**/dist/**",
        "**/build/**",
        "**/.react-router/**",
      ],
      nodir: true,
    })

    const results: CodemodFileResult[] = []
    for (const file of files.sort()) {
      const original = readFileSync(file, "utf-8")
      if (!original.includes("@qualcomm-ui/react-mdx/")) {
        continue
      }
      const result = transformDocsContextNames(original, file)
      if (result.content !== original && !dryRun) {
        writeFileSync(file, result.content, "utf-8")
      }
      results.push({
        file,
        message: describeResult(result, dryRun),
        status: result.status,
      })
    }
    return results
  },
  title: "Rename the deprecated docs context exports",
  versions: {
    "@qualcomm-ui/react-mdx": {from: 3, to: 3},
  },
}
