// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type JsxElement,
  type JsxOpeningElement,
  type JsxSelfClosingElement,
  type Node,
  type Project,
  type SourceFile,
  SyntaxKind,
} from "ts-morph"

import type {RenderGraph} from "./render-graph"
import {
  buildQuiImportTable,
  type QuiImportTable,
  resolveQuiTag,
} from "./tag-resolution"
import type {
  FixEdit,
  HasAncestorOptions,
  JsxHostNode,
  QuiAuditRule,
  QuiComponentMatcher,
  RuleContext,
  Violation,
  ViolationInput,
} from "./types"

export function createRuleContext(args: {
  project: Project
  renderGraph: RenderGraph
  rule: QuiAuditRule
}): RuleContext {
  const {project, renderGraph, rule} = args
  const importCache = new Map<SourceFile, QuiImportTable>()

  function getImports(sourceFile: SourceFile): QuiImportTable {
    let table = importCache.get(sourceFile)
    if (!table) {
      table = buildQuiImportTable(sourceFile)
      importCache.set(sourceFile, table)
    }
    return table
  }

  function resolveTag(node: JsxHostNode): string | null {
    return resolveQuiTag(node, getImports(node.getSourceFile()))
  }

  function hasAncestor(
    node: JsxHostNode,
    tags: QuiComponentMatcher | readonly QuiComponentMatcher[],
    options?: HasAncestorOptions,
  ): boolean {
    const matchers = new Set(Array.isArray(tags) ? tags : [tags])
    const followWrappers = options?.followWrappers ?? false

    let current: Node | undefined = node.getParent()
    while (current) {
      const ancestorJsx = asJsxHost(current)
      if (ancestorJsx && ancestorJsx !== node) {
        const quiTag = resolveTag(ancestorJsx)
        if (quiTag && matchers.has(quiTag)) {
          return true
        }

        if (followWrappers && !quiTag) {
          const bare = getJsxBareIdentifier(ancestorJsx)
          if (bare) {
            const resolved = renderGraph.resolveWrapper(bare)
            if (resolved && matchers.has(resolved)) {
              return true
            }
          }
        }
      }
      current = current.getParent()
    }

    return false
  }

  function violation(input: ViolationInput): Violation {
    const {fixable = false, message, node} = input
    const sourceFile = node.getSourceFile()
    const start = node.getStart()
    const end = node.getEnd()
    const {column, line} = sourceFile.getLineAndColumnAtPos(start)

    return {
      category: rule.category,
      column,
      file: sourceFile.getFilePath(),
      fixable,
      line,
      message,
      nodeEnd: end,
      nodeStart: start,
      ruleId: rule.id,
      severity: rule.severity,
    }
  }

  function replaceTag(element: JsxHostNode, newTag: string): FixEdit[] {
    const filePath = element.getSourceFile().getFilePath()
    const edits: FixEdit[] = []

    if (element.getKind() === SyntaxKind.JsxElement) {
      const jsxElement = element as JsxElement
      edits.push(tagNameEdit(jsxElement.getOpeningElement(), newTag, filePath))
      const closing = jsxElement.getClosingElement()
      const closingName = closing.getTagNameNode()
      edits.push({
        end: closingName.getEnd(),
        file: filePath,
        replacement: newTag,
        start: closingName.getStart(),
      })
    } else {
      edits.push(
        tagNameEdit(element as JsxSelfClosingElement, newTag, filePath),
      )
    }

    return edits
  }

  return {
    hasAncestor,
    project,
    renderGraph,
    replaceTag,
    resolveQuiTag: resolveTag,
    violation,
  }
}

function tagNameEdit(
  opening: JsxOpeningElement | JsxSelfClosingElement,
  newTag: string,
  filePath: string,
): FixEdit {
  const tagName = opening.getTagNameNode()
  return {
    end: tagName.getEnd(),
    file: filePath,
    replacement: newTag,
    start: tagName.getStart(),
  }
}

function asJsxHost(node: Node): JsxHostNode | null {
  const kind = node.getKind()
  if (kind === SyntaxKind.JsxElement) {
    return node as JsxElement
  }
  if (kind === SyntaxKind.JsxSelfClosingElement) {
    return node as JsxSelfClosingElement
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
