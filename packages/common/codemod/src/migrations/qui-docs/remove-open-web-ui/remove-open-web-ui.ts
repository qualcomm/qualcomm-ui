// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {glob} from "glob"
import {readFile, writeFile} from "node:fs/promises"
import {Node, type ObjectLiteralExpression, Project, SyntaxKind} from "ts-morph"

import type {
  Codemod,
  CodemodFileResult,
  CodemodFileStatus,
} from "../../types.js"

const CONFIG_GLOB = "**/qui-docs.config.{ts,mts,cts,js,mjs,cjs}"

export interface RemoveOpenWebUiResult {
  content: string
  /** What must be updated manually. */
  manual: string[]
  /** What was removed, in plain language. */
  removed: string[]
  /**
   * - `updated`: Open WebUI usage was removed.
   * - `unchanged`: nothing to remove.
   * - `conflict`: some usage must be removed manually. Other usage in the file
   *   may still have been removed.
   */
  status: CodemodFileStatus
}

function getStatus(
  removed: string[],
  manual: string[],
): RemoveOpenWebUiResult["status"] {
  return manual.length ? "conflict" : removed.length ? "updated" : "unchanged"
}

function getPropertyName(node: Node): string | undefined {
  if (
    Node.isPropertyAssignment(node) ||
    Node.isShorthandPropertyAssignment(node)
  ) {
    const nameNode = node.getNameNode()
    return Node.isStringLiteral(nameNode)
      ? nameNode.getLiteralValue()
      : nameNode.getText()
  }
  return undefined
}

function findProperty(
  object: ObjectLiteralExpression,
  name: string,
): Node | undefined {
  return object.getProperties().find((prop) => getPropertyName(prop) === name)
}

/**
 * Whether `object` is the value of a `knowledge` property.
 */
function isKnowledgeConfig(object: ObjectLiteralExpression): boolean {
  const parent = object.getParent()
  return (
    Node.isPropertyAssignment(parent) && getPropertyName(parent) === "knowledge"
  )
}

interface Edit {
  end: number
  start: number
}

function applyEdits(content: string, edits: Edit[]): string {
  let result = content
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    result = `${result.slice(0, edit.start)}${result.slice(edit.end)}`
  }
  return result
}

/**
 * Returns the range that removes an object property and its separating comma
 * while keeping the formatting of the surrounding properties, including
 * trailing commas.
 */
function getPropertyRemoval(content: string, prop: Node): Edit {
  const start = prop.getStart()
  const next = prop.getNextSibling()
  const commaEnd =
    next?.getKind() === SyntaxKind.CommaToken ? next.getEnd() : undefined
  const end = commaEnd ?? prop.getEnd()

  const lineStart = content.lastIndexOf("\n", start - 1) + 1
  const lineEnd = content.indexOf("\n", end)
  const ownsLines =
    /^[ \t]*$/.test(content.slice(lineStart, start)) &&
    lineEnd !== -1 &&
    /^[ \t]*$/.test(content.slice(end, lineEnd))
  if (ownsLines) {
    return {end: lineEnd + 1, start: lineStart}
  }

  if (commaEnd !== undefined) {
    const trailingSpace = /^[ \t]*/.exec(content.slice(commaEnd))![0].length
    return {end: commaEnd + trailingSpace, start}
  }

  const previousComma = content.slice(0, start).search(/,\s*$/)
  return {end, start: previousComma === -1 ? start : previousComma}
}

/**
 * Removes `knowledge.integrations` from a qui-docs config. Open WebUI was its
 * only integration, so the whole field is removed. Edited objects aren't
 * reformatted.
 */
export function transformQuiDocsConfig(
  content: string,
  filePath = "qui-docs.config.ts",
): RemoveOpenWebUiResult {
  const sourceFile = new Project({
    useInMemoryFileSystem: true,
  }).createSourceFile(filePath, content, {overwrite: true})
  const removed: string[] = []
  const manual: string[] = []
  const edits: Edit[] = []

  const integrationsProperties = sourceFile
    .getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression)
    .flatMap((object) => {
      const prop = findProperty(object, "integrations")
      if (!prop) {
        return []
      }
      const initializer = Node.isPropertyAssignment(prop)
        ? prop.getInitializer()
        : undefined
      const hasOpenWebUi =
        Node.isObjectLiteralExpression(initializer) &&
        !!findProperty(initializer, "openWebUi")
      return isKnowledgeConfig(object) || hasOpenWebUi ? [prop] : []
    })

  for (const prop of integrationsProperties) {
    const initializer = Node.isPropertyAssignment(prop)
      ? prop.getInitializer()
      : undefined
    if (!Node.isObjectLiteralExpression(initializer)) {
      manual.push(
        `remove knowledge.integrations (line ${prop.getStartLineNumber()})`,
      )
      continue
    }
    const unknown = initializer
      .getProperties()
      .map(getPropertyName)
      .filter((name) => name !== "openWebUi")
    if (unknown.length) {
      manual.push(
        `remove knowledge.integrations (line ${prop.getStartLineNumber()}), it has unsupported properties: ${unknown.join(", ")}`,
      )
      continue
    }
    edits.push(getPropertyRemoval(content, prop))
    removed.push("knowledge.integrations")
  }

  const typeReferences = sourceFile
    .getDescendantsOfKind(SyntaxKind.Identifier)
    .filter((node) => node.getText() === "OpenWebUiIntegration")
  if (typeReferences.length) {
    manual.push(
      `remove references to the OpenWebUiIntegration type (line ${typeReferences[0].getStartLineNumber()})`,
    )
  }

  return {
    content: applyEdits(content, edits),
    manual,
    removed,
    status: getStatus(removed, manual),
  }
}

function describeResult(
  {manual, removed, status}: RemoveOpenWebUiResult,
  dryRun: boolean,
): string {
  const verb = dryRun ? "would remove" : "removed"
  const summary = removed.length ? `${verb} ${removed.join(", ")}` : ""
  switch (status) {
    case "updated":
      return summary
    case "unchanged":
    case "skipped":
      return "no Open WebUI usage found"
    case "conflict":
      return `${summary ? `${summary}, ` : ""}update manually: ${manual.join("; ")}`
  }
}

export const removeOpenWebUi: Codemod<"@qualcomm-ui/mdx-vite"> = {
  name: "remove-open-web-ui",
  noMatchMessage: "no Open WebUI usage found, nothing to change",
  run: async ({cwd, dryRun}) => {
    const configFiles = await glob(CONFIG_GLOB, {
      absolute: true,
      cwd,
      ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
      nodir: true,
    })

    const results: CodemodFileResult[] = []
    for (const file of configFiles.sort()) {
      const original = await readFile(file, "utf-8")
      const result = transformQuiDocsConfig(original, file)
      if (result.status === "unchanged") {
        continue
      }
      if (result.content !== original && !dryRun) {
        await writeFile(file, result.content, "utf-8")
      }
      results.push({
        file,
        message: describeResult(result, dryRun),
        status: result.status,
      })
    }
    return results
  },
  title: "Remove the Open WebUI knowledge integration",
  versions: {
    "@qualcomm-ui/mdx-vite": {from: 4, to: 4},
  },
}
