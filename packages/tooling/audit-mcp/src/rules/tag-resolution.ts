// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type ImportDeclaration,
  type JsxElement,
  type JsxSelfClosingElement,
  type SourceFile,
  SyntaxKind,
} from "ts-morph"

import type {JsxHostNode} from "./types"

const QUI_PACKAGE_PREFIXES = [
  "@qualcomm-ui/react",
  "@qualcomm-ui/react-internal",
]

export function isQuiPackage(moduleSpecifier: string): boolean {
  return QUI_PACKAGE_PREFIXES.some(
    (prefix) =>
      moduleSpecifier === prefix || moduleSpecifier.startsWith(`${prefix}/`),
  )
}

/**
 * Per-source-file cache of QUI imports.
 *
 * Maps the local identifier used in JSX (e.g. `Btn` when imported as
 * `{Button as Btn}`) to the imported export name (e.g. `Button`).
 * Namespace imports map the local name to `"*"`.
 */
export interface QuiImportTable {
  /** local identifier → imported export name (or `"*"` for namespace imports). */
  readonly identifiers: ReadonlyMap<string, string>
  /**
   * set of namespace-import local names (e.g. `QUI` from `import * as QUI from
   * ...`).
   */
  readonly namespaces: ReadonlySet<string>
}

export function buildQuiImportTable(sourceFile: SourceFile): QuiImportTable {
  const identifiers = new Map<string, string>()
  const namespaces = new Set<string>()

  for (const importDecl of sourceFile.getImportDeclarations()) {
    const moduleSpecifier = importDecl.getModuleSpecifierValue()
    if (!isQuiPackage(moduleSpecifier)) {
      continue
    }

    collectNamedImports(importDecl, identifiers)

    const namespaceImport = importDecl.getNamespaceImport()
    if (namespaceImport) {
      namespaces.add(namespaceImport.getText())
    }
  }

  return {identifiers, namespaces}
}

function collectNamedImports(
  importDecl: ImportDeclaration,
  identifiers: Map<string, string>,
): void {
  for (const namedImport of importDecl.getNamedImports()) {
    const localName =
      namedImport.getAliasNode()?.getText() ?? namedImport.getName()
    identifiers.set(localName, namedImport.getName())
  }
}

/**
 * Resolves a JSX element's tag to its canonical QUI-import name, or `null` if
 * the element is not a QUI component.
 *
 * Examples:
 * - `<HeaderBar>` where `HeaderBar` is imported from `@qualcomm-ui/react/header-bar`
 *   → `"HeaderBar"`
 * - `<HeaderBar.Root>` → `"HeaderBar.Root"`
 * - `<Btn>` where `{Button as Btn}` is imported → `"Button"`
 * - `<QUI.HeaderBar>` where `QUI` is a namespace import → `"HeaderBar"`
 * - `<div>`, `<NonQuiComponent>` → `null`
 */
export function resolveQuiTag(
  element: JsxHostNode,
  imports: QuiImportTable,
): string | null {
  const tagNode = getTagNameNode(element)
  if (!tagNode) {
    return null
  }

  if (tagNode.kind === "identifier") {
    const imported = imports.identifiers.get(tagNode.identifier)
    return imported ?? null
  }

  if (tagNode.kind === "namespacedProperty") {
    if (imports.namespaces.has(tagNode.namespace)) {
      return tagNode.property
    }
    const imported = imports.identifiers.get(tagNode.namespace)
    return imported ? `${imported}.${tagNode.property}` : null
  }

  return null
}

type TagNameNode =
  | {identifier: string; kind: "identifier"}
  | {kind: "namespacedProperty"; namespace: string; property: string}

function getTagNameNode(element: JsxHostNode): TagNameNode | null {
  const opening =
    element.getKind() === SyntaxKind.JsxElement
      ? (element as JsxElement).getOpeningElement()
      : (element as JsxSelfClosingElement)

  const tagName = opening.getTagNameNode()
  const kind = tagName.getKind()

  if (kind === SyntaxKind.Identifier) {
    return {identifier: tagName.getText(), kind: "identifier"}
  }

  if (kind === SyntaxKind.PropertyAccessExpression) {
    const text = tagName.getText()
    const [namespace, ...rest] = text.split(".")
    if (!namespace || rest.length === 0) {
      return null
    }
    return {
      kind: "namespacedProperty",
      namespace,
      property: rest.join("."),
    }
  }

  return null
}
