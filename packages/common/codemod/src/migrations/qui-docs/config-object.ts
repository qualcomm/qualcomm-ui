// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {glob} from "glob"
import {readFile, writeFile} from "node:fs/promises"
import {
  Node,
  type ObjectLiteralExpression,
  Project,
  type SourceFile,
  SyntaxKind,
} from "ts-morph"

import type {
  CodemodContext,
  CodemodFileResult,
  CodemodFileStatus,
} from "../types.js"

const CONFIG_GLOB = "**/qui-docs.config.{ts,mts,cts,js,mjs,cjs}"
const CONFIG_IGNORE = ["**/node_modules/**", "**/dist/**", "**/build/**"]

export interface ConfigEdit {
  end: number
  start: number
  text: string
}

export interface ConfigTransformResult {
  /** What was changed, in plain language. */
  changed: string[]
  content: string
  /** What must be updated manually. */
  manual: string[]
  /**
   * - `updated`: the config was changed.
   * - `unchanged`: nothing to change.
   * - `conflict`: some usage must be updated manually. Other usage in the file
   *   may still have been changed.
   */
  status: CodemodFileStatus
}

export function parseConfig(content: string, filePath: string): SourceFile {
  return new Project({useInMemoryFileSystem: true}).createSourceFile(
    filePath,
    content,
    {overwrite: true},
  )
}

export function getStatus(
  changed: string[],
  manual: string[],
): CodemodFileStatus {
  return manual.length ? "conflict" : changed.length ? "updated" : "unchanged"
}

export function getPropertyName(node: Node): string | undefined {
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

export function findProperty(
  object: ObjectLiteralExpression,
  name: string,
): Node | undefined {
  return object.getProperties().find((prop) => getPropertyName(prop) === name)
}

export function applyEdits(content: string, edits: ConfigEdit[]): string {
  let result = content
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    result = `${result.slice(0, edit.start)}${edit.text}${result.slice(edit.end)}`
  }
  return result
}

/**
 * Returns the edit that removes an object property and its separating comma
 * while keeping the formatting of the surrounding properties, including
 * trailing commas.
 */
export function getPropertyRemoval(content: string, prop: Node): ConfigEdit {
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
    return {end: lineEnd + 1, start: lineStart, text: ""}
  }

  if (commaEnd !== undefined) {
    const trailingSpace = /^[ \t]*/.exec(content.slice(commaEnd))![0].length
    return {end: commaEnd + trailingSpace, start, text: ""}
  }

  const previousComma = content.slice(0, start).search(/,\s*$/)
  return {end, start: previousComma === -1 ? start : previousComma, text: ""}
}

/**
 * Returns the edit that adds `text` as the first property of `object`,
 * matching its single-line or multi-line layout.
 */
export function getPropertyInsertion(
  content: string,
  object: ObjectLiteralExpression,
  text: string,
): ConfigEdit {
  const [first] = object.getProperties()
  const open = object.getStart() + 1
  if (!first) {
    return {end: object.getEnd() - 1, start: open, text}
  }
  const lineStart = content.lastIndexOf("\n", first.getStart() - 1) + 1
  const indent = content.slice(lineStart, first.getStart())
  const start = first.getStart()
  return /^[ \t]+$/.test(indent) && lineStart > open
    ? {end: start, start, text: `${text},\n${indent}`}
    : {end: start, start, text: `${text}, `}
}

/**
 * Describes a transform result, e.g. "removed knowledge.integrations".
 *
 * @param verb describes the changes, e.g. "removed" or "would remove". Omit it
 * when each change includes its own verb.
 */
export function describeConfigResult(
  {changed, manual, status}: ConfigTransformResult,
  verb: string,
  noMatch: string,
): string {
  const summary = changed.length
    ? [verb, changed.join(", ")].filter(Boolean).join(" ")
    : ""
  switch (status) {
    case "updated":
      return summary
    case "unchanged":
    case "skipped":
      return noMatch
    case "conflict":
      return `${summary ? `${summary}, ` : ""}update manually: ${manual.join("; ")}`
  }
}

/**
 * Runs a config transform on every qui-docs config under `cwd`. Configs that
 * don't need the transform are left out of the results.
 */
export async function runConfigTransform(
  {cwd, dryRun}: CodemodContext,
  transform: (content: string, file: string) => ConfigTransformResult,
  describe: (result: ConfigTransformResult) => string,
): Promise<CodemodFileResult[]> {
  const configFiles = await glob(CONFIG_GLOB, {
    absolute: true,
    cwd,
    ignore: CONFIG_IGNORE,
    nodir: true,
  })

  const results: CodemodFileResult[] = []
  for (const file of configFiles.sort()) {
    const original = await readFile(file, "utf-8")
    const result = transform(original, file)
    if (result.status === "unchanged") {
      continue
    }
    if (result.content !== original && !dryRun) {
      await writeFile(file, result.content, "utf-8")
    }
    results.push({file, message: describe(result), status: result.status})
  }
  return results
}
