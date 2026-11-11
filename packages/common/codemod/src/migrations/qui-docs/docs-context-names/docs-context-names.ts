// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {glob} from "glob"
import {readFileSync, writeFileSync} from "node:fs"
import type {SourceFile} from "ts-morph"

import {
  applyEdits,
  type Edit,
  getNamespaceMembers,
  getTopLevelBindings,
  moveNamedImports,
  parseSource,
  renameReferences,
} from "../../shared/source-edits.js"
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

/**
 * Replaces the deprecated docs context exports of `@qualcomm-ui/react-mdx` with
 * their replacements, and moves page context imports from the docs-layout entry
 * to the context entry. Edited imports aren't reformatted.
 */
export function transformDocsContextNames(
  content: string,
  filePath = "file.tsx",
): DocsContextNamesResult {
  const sourceFile = parseSource(content, filePath)
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
    // The page context replacements are only exported from the context entry.
    result.content =
      moveNamedImports(
        parseSource(result.content, filePath),
        DOCS_LAYOUT_MODULE,
        CONTEXT_MODULE,
        (name) => PAGE_CONTEXT_NAMES.has(name),
      ) ?? result.content
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
