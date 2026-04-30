// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type ArrowFunction,
  type FunctionDeclaration,
  type FunctionExpression,
  type JsxElement,
  type JsxSelfClosingElement,
  type Node,
  type Project,
  type SourceFile,
  SyntaxKind,
} from "ts-morph"

import {
  buildQuiImportTable,
  type QuiImportTable,
  resolveQuiTag,
} from "./tag-resolution"
import type {JsxHostNode} from "./types"

type ComponentBodyNode =
  | ArrowFunction
  | FunctionDeclaration
  | FunctionExpression

/**
 * Per-wrapper resolution. A wrapper is a user-defined React component whose
 * JSX root unambiguously renders a known QUI component (possibly transitively
 * through another wrapper).
 */
interface WrapperEdge {
  /**
   * Whether the root tag is a QUI import (`true`) or another wrapper name
   * (`false`).
   */
  readonly isQui: boolean
  /** The canonical QUI tag or the wrapper name at the JSX root. */
  readonly rootTag: string
}

export interface RenderGraph {
  /**
   * Returns the canonical QUI tag name that a user-defined wrapper
   * transitively renders at its JSX root, or `null` if the wrapper is unknown
   * or its root cannot be resolved unambiguously (conditional roots,
   * non-JSX returns, dynamic JSX, cycles).
   *
   * Example: `resolveWrapper("AppHeader") // → "HeaderBar"`
   */
  resolveWrapper(wrapperName: string): string | null
  /** Visible wrapper names. Exposed for introspection + debugging. */
  readonly wrapperNames: readonly string[]
}

/**
 * Build a render graph over the project by scanning every component-like
 * declaration and recording its JSX root. Call once per audit run; pass the
 * resulting graph to every rule via `RuleContext`.
 */
export function buildRenderGraph(project: Project): RenderGraph {
  const edges = new Map<string, WrapperEdge | null>()

  for (const sourceFile of project.getSourceFiles()) {
    const imports = buildQuiImportTable(sourceFile)
    for (const [name, body] of iterateComponentBodies(sourceFile)) {
      if (edges.has(name)) {
        continue
      }
      edges.set(name, computeWrapperEdge(body, imports))
    }
  }

  return {
    resolveWrapper: (wrapperName) => resolve(edges, wrapperName, new Set()),
    wrapperNames: Array.from(edges.keys()),
  }
}

function resolve(
  edges: ReadonlyMap<string, WrapperEdge | null>,
  name: string,
  visited: Set<string>,
): string | null {
  if (visited.has(name)) {
    return null
  }
  visited.add(name)

  const edge = edges.get(name)
  if (!edge) {
    return null
  }
  if (edge.isQui) {
    return edge.rootTag
  }
  return resolve(edges, edge.rootTag, visited)
}

function* iterateComponentBodies(
  sourceFile: SourceFile,
): Iterable<[string, ComponentBodyNode]> {
  for (const fn of sourceFile.getFunctions()) {
    const name = fn.getName()
    if (name && isComponentName(name)) {
      yield [name, fn]
    }
  }

  for (const variable of sourceFile.getVariableDeclarations()) {
    const name = variable.getName()
    if (!isComponentName(name)) {
      continue
    }
    const initializer = variable.getInitializer()
    if (!initializer) {
      continue
    }

    if (initializer.isKind(SyntaxKind.ArrowFunction)) {
      yield [name, initializer]
    } else if (initializer.isKind(SyntaxKind.FunctionExpression)) {
      yield [name, initializer]
    }
  }
}

function isComponentName(name: string): boolean {
  return /^[A-Z]/.test(name)
}

function computeWrapperEdge(
  body: ComponentBodyNode,
  imports: QuiImportTable,
): WrapperEdge | null {
  const root = getJsxRoot(body)
  if (!root) {
    return null
  }

  const quiTag = resolveQuiTag(root, imports)
  if (quiTag) {
    return {isQui: true, rootTag: quiTag}
  }

  const bareName = getJsxBareIdentifier(root)
  if (bareName && isComponentName(bareName)) {
    return {isQui: false, rootTag: bareName}
  }

  return null
}

/**
 * Finds the JSX element returned at the root of a component body, if
 * unambiguously resolvable. Returns `null` for conditional roots, fragment
 * roots, non-JSX returns, or multi-return functions.
 */
function getJsxRoot(body: ComponentBodyNode): JsxHostNode | null {
  const bodyNode = body.getBody()
  if (!bodyNode) {
    return null
  }

  if (bodyNode.isKind(SyntaxKind.JsxElement)) {
    return bodyNode
  }
  if (bodyNode.isKind(SyntaxKind.JsxSelfClosingElement)) {
    return bodyNode
  }

  if (bodyNode.isKind(SyntaxKind.Block)) {
    const returnStatements = bodyNode.getDescendantsOfKind(
      SyntaxKind.ReturnStatement,
    )
    if (returnStatements.length !== 1) {
      return null
    }
    const expression = returnStatements[0]?.getExpression()
    if (!expression) {
      return null
    }
    return normalizeToJsxHost(expression)
  }

  return null
}

function normalizeToJsxHost(node: Node): JsxHostNode | null {
  if (node.isKind(SyntaxKind.JsxElement)) {
    return node
  }
  if (node.isKind(SyntaxKind.JsxSelfClosingElement)) {
    return node
  }
  if (node.isKind(SyntaxKind.ParenthesizedExpression)) {
    return normalizeToJsxHost(node.getExpression())
  }
  return null
}

function getJsxBareIdentifier(element: JsxHostNode): string | null {
  const opening =
    element.getKind() === SyntaxKind.JsxElement
      ? (element as JsxElement).getOpeningElement()
      : (element as JsxSelfClosingElement)

  const tagName = opening.getTagNameNode()
  if (tagName.getKind() === SyntaxKind.Identifier) {
    return tagName.getText()
  }
  return null
}
