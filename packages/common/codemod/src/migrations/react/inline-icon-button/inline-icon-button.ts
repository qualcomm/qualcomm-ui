// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {glob} from "glob"
import {readFile, writeFile} from "node:fs/promises"
import {Node, type SourceFile, SyntaxKind} from "ts-morph"

import {
  COMPACT_DENSITY,
  describeInlineIconButtonResult,
  getAttributeSeparator,
  getInlineIconButtonStatus,
  GHOST_VARIANT,
  type InlineIconButtonResult,
} from "../../shared/inline-icon-button.js"
import {
  applyEdits,
  type Edit,
  getTopLevelBindings,
  moveNamedImports,
  parseSource,
  referencesModule,
  renameReferences,
} from "../../shared/source-edits.js"
import type {Codemod, CodemodFileResult} from "../../types.js"

const INLINE_ICON_BUTTON_MODULE = "@qualcomm-ui/react/inline-icon-button"
const BUTTON_MODULE = "@qualcomm-ui/react/button"

/**
 * InlineIconButton export to its `@qualcomm-ui/react/button` replacement.
 */
const RENAMES: Readonly<Record<string, string>> = {
  InlineIconButton: "IconButton",
  InlineIconButtonProps: "IconButtonProps",
}

const REPLACEMENT_NAMES = new Set(Object.values(RENAMES))

/**
 * Returns the local names of the named imports of `module`, keyed by export
 * name. Type-only imports are included only when `includeTypes` is set.
 */
function getImportedLocals(
  sourceFile: SourceFile,
  module: string,
  includeTypes: boolean,
): Map<string, string> {
  const locals = new Map<string, string>()
  for (const decl of sourceFile.getImportDeclarations()) {
    if (decl.getModuleSpecifierValue() !== module) {
      continue
    }
    for (const specifier of decl.getNamedImports()) {
      if (!includeTypes && (decl.isTypeOnly() || specifier.isTypeOnly())) {
        continue
      }
      locals.set(
        specifier.getName(),
        specifier.getAliasNode()?.getText() ?? specifier.getName(),
      )
    }
  }
  return locals
}

/**
 * Whether the reference is a JSX tag name or a type query (`typeof X`), the
 * usages that don't depend on InlineIconButton's props.
 */
function isTagOrTypeReference(node: Node): boolean {
  const parent = node.getParent()
  return (
    Node.isJsxOpeningElement(parent) ||
    Node.isJsxSelfClosingElement(parent) ||
    Node.isJsxClosingElement(parent) ||
    Node.isTypeQuery(parent)
  )
}

/**
 * Converts the InlineIconButton elements to compact ghost IconButtons, and
 * renames the InlineIconButton imports and their references. The imports are
 * moved afterward.
 */
function replaceInlineIconButtons(
  sourceFile: SourceFile,
): Omit<InlineIconButtonResult, "status"> {
  const content = sourceFile.getFullText()
  const edits: Edit[] = []
  const manual: string[] = []
  const bindings = getTopLevelBindings(sourceFile)
  const valueImports = getImportedLocals(sourceFile, BUTTON_MODULE, false)
  const typeImports = getImportedLocals(sourceFile, BUTTON_MODULE, true)
  const components = new Set<string>()
  let replaced = 0

  for (const decl of sourceFile.getImportDeclarations()) {
    if (decl.getModuleSpecifierValue() !== INLINE_ICON_BUTTON_MODULE) {
      continue
    }
    if (decl.getNamespaceImport()) {
      manual.push(
        `replace the namespace import of "${INLINE_ICON_BUTTON_MODULE}" on line ${decl.getStartLineNumber()} with IconButton from "${BUTTON_MODULE}"`,
      )
      continue
    }
    for (const specifier of decl.getNamedImports()) {
      const name = specifier.getName()
      if (!Object.hasOwn(RENAMES, name)) {
        continue
      }
      const newName = RENAMES[name]
      const localNode = specifier.getAliasNode() ?? specifier.getNameNode()
      const local = localNode.getText()
      const existing = (
        name === "InlineIconButton" ? valueImports : typeImports
      ).get(newName)

      let target: string
      if (existing) {
        // Reuse the existing import, which the move then deduplicates.
        target = existing
      } else if (specifier.getAliasNode()) {
        target = local
      } else if (bindings.has(newName)) {
        // The new name is already bound in this file, so keep the old one.
        target = name
      } else {
        target = newName
      }

      if (name === "InlineIconButton") {
        components.add(local)
        for (const reference of localNode
          .asKindOrThrow(SyntaxKind.Identifier)
          .findReferencesAsNodes()) {
          if (
            reference.getSourceFile() !== sourceFile ||
            reference.getFirstAncestorByKind(SyntaxKind.ImportDeclaration) ||
            isTagOrTypeReference(reference)
          ) {
            continue
          }
          manual.push(
            `${target} on line ${reference.getStartLineNumber()} isn't rendered as JSX, add ${COMPACT_DENSITY} and ${GHOST_VARIANT} where it's rendered`,
          )
        }
      }

      if (target !== local) {
        renameReferences(localNode, local, target, edits)
      }
      edits.push({
        end: specifier.getEnd(),
        start: specifier.getNameNode().getStart(),
        text: target === newName ? newName : `${newName} as ${target}`,
      })
    }
  }

  for (const decl of sourceFile.getExportDeclarations()) {
    if (decl.getModuleSpecifierValue() === INLINE_ICON_BUTTON_MODULE) {
      manual.push(
        `replace the re-export of "${INLINE_ICON_BUTTON_MODULE}" on line ${decl.getStartLineNumber()} with IconButton from "${BUTTON_MODULE}"`,
      )
    }
  }

  if (components.size) {
    const elements = [
      ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
      ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
    ]
    for (const element of elements) {
      const tagName = element.getTagNameNode()
      if (!components.has(tagName.getText())) {
        continue
      }
      const attributes = element.getAttributes()
      const variant = attributes.find(
        (attribute) =>
          Node.isJsxAttribute(attribute) &&
          attribute.getNameNode().getText() === "variant",
      )
      if (variant) {
        edits.push({
          end: variant.getEnd(),
          start: variant.getStart(),
          text: GHOST_VARIANT,
        })
      }
      const separator = attributes.length
        ? getAttributeSeparator(content, attributes[0].getStart())
        : " "
      const added = variant
        ? [COMPACT_DENSITY]
        : [COMPACT_DENSITY, GHOST_VARIANT]
      edits.push({
        end: tagName.getEnd(),
        start: tagName.getEnd(),
        text: added.map((attribute) => `${separator}${attribute}`).join(""),
      })
      replaced++
    }
  }

  return {content: applyEdits(content, edits), manual, replaced}
}

/**
 * Replaces the deprecated InlineIconButton with
 * `<IconButton density="compact" variant="ghost">`, and moves its imports to
 * `@qualcomm-ui/react/button`. Edited imports and props aren't reformatted.
 */
export function transformReactInlineIconButton(
  content: string,
  filePath = "file.tsx",
): InlineIconButtonResult {
  const sourceFile = parseSource(content, filePath)
  if (
    !referencesModule(
      sourceFile,
      (module) => module === INLINE_ICON_BUTTON_MODULE,
    )
  ) {
    return {content, manual: [], replaced: 0, status: "skipped"}
  }

  const result = replaceInlineIconButtons(sourceFile)
  result.content =
    moveNamedImports(
      parseSource(result.content, filePath),
      INLINE_ICON_BUTTON_MODULE,
      BUTTON_MODULE,
      (name) => REPLACEMENT_NAMES.has(name),
    ) ?? result.content

  return {
    ...result,
    status: getInlineIconButtonStatus(content, result.content, result.manual),
  }
}

export const reactInlineIconButton: Codemod<"@qualcomm-ui/react"> = {
  name: "inline-icon-button",
  noMatchMessage: "no imports of InlineIconButton found, nothing to change",
  run: async ({cwd, dryRun}) => {
    const files = await glob("**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}", {
      absolute: true,
      cwd,
      ignore: [
        "**/node_modules/**",
        "**/dist/**",
        "**/build/**",
        "**/coverage/**",
        "**/.react-router/**",
      ],
      nodir: true,
    })

    const results: CodemodFileResult[] = []
    for (const file of files.sort()) {
      const original = await readFile(file, "utf-8")
      if (!original.includes(INLINE_ICON_BUTTON_MODULE)) {
        continue
      }
      const result = transformReactInlineIconButton(original, file)
      if (result.content !== original && !dryRun) {
        await writeFile(file, result.content, "utf-8")
      }
      results.push({
        file,
        message: describeInlineIconButtonResult(
          result,
          dryRun,
          "doesn't import InlineIconButton, ignored",
        ),
        status: result.status,
      })
    }
    return results
  },
  title: "Replace InlineIconButton with the compact IconButton",
  versions: {
    "@qualcomm-ui/react": {from: 1, to: 2},
  },
}
