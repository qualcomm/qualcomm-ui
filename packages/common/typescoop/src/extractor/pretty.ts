// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {format, type FormatConfig} from "oxfmt"
import ts from "typescript"

import {dedent} from "../internal/dedent.js"

export const defaultPrintWidth = 30

const formatConfig: FormatConfig = {
  bracketSpacing: false,
  endOfLine: "lf",
  insertFinalNewline: false,
  jsxSingleQuote: true,
  printWidth: defaultPrintWidth,
  semi: false,
  singleQuote: true,
  trailingComma: "all",
}

/**
 * TypeDoc's name for destructured parameters. The type printer gives them this
 * name so that printed function types are valid syntax for the formatter, and
 * it is removed from the displayed type.
 */
export const namedParameters = "__namedParameters"

const namedParametersLabel = `${namedParameters}: `

/**
 * Removes the placeholder name of destructured parameters from a printed type.
 */
export function withoutNamedParameters(type: string): string {
  return type.replaceAll(namedParametersLabel, "")
}

const cache = new Map<string, Promise<string>>()

async function formatType(type: string, printWidth: number): Promise<string> {
  try {
    // the formatter needs a complete statement to parse the type.
    const result = await format("file.tsx", `type ___DUMMY = ${type}`, {
      ...formatConfig,
      printWidth,
    })
    return dedent(result.code.replace("type ___DUMMY =", " ").trim())
  } catch {
    return type
  }
}

function formatCached(type: string, printWidth: number): Promise<string> {
  // formatting is expensive, and short types without spaces are already final.
  if (!type.includes(" ") && type.length <= printWidth) {
    return Promise.resolve(type)
  }
  const key = `${printWidth}:${type}`
  let pending = cache.get(key)
  if (!pending) {
    pending = formatType(type, printWidth)
    cache.set(key, pending)
  }
  return pending
}

/**
 * Formats a type string for display.
 */
export async function prettyType(
  type: string,
  printWidth: number = defaultPrintWidth,
): Promise<string> {
  return withoutNamedParameters(await formatCached(type, printWidth))
}

export interface TextSpan {
  end: number
  start: number
}

const spanPrefix = "type ___DUMMY = "

/**
 * The type nodes of a printed type in document order. Parentheses are skipped
 * because the formatter may add or remove them.
 */
function typeNodes(type: string): ts.Node[] | undefined {
  const file = ts.createSourceFile(
    "type.ts",
    `${spanPrefix}${type}`,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const [statement] = file.statements
  if (
    file.statements.length !== 1 ||
    !statement ||
    !ts.isTypeAliasDeclaration(statement)
  ) {
    return undefined
  }
  const nodes: ts.Node[] = []
  const visit = (node: ts.Node) => {
    if (!ts.isParenthesizedTypeNode(node)) {
      nodes.push(node)
    }
    node.forEachChild(visit)
  }
  visit(statement.type)
  return nodes
}

/**
 * Maps spans of a printed type onto its formatted text. Formatting only
 * changes whitespace, quotes, and parentheses, so a span that covers a type
 * node covers the node at the same position in the formatted syntax tree.
 */
function mapSpans(
  type: string,
  formatted: string,
  spans: TextSpan[],
): (TextSpan | undefined)[] {
  // short types and types that fail to format are returned unchanged.
  if (formatted === type) {
    return spans
  }
  const source = typeNodes(type)
  const target = typeNodes(formatted)
  if (!source || !target || source.length !== target.length) {
    return spans.map(() => undefined)
  }
  const offset = spanPrefix.length
  return spans.map((span) => {
    const index = source.findIndex(
      (node) =>
        node.getStart() - offset === span.start &&
        node.getEnd() - offset === span.end,
    )
    const node = target[index]
    if (index < 0 || !node || node.kind !== source[index].kind) {
      return undefined
    }
    return {end: node.getEnd() - offset, start: node.getStart() - offset}
  })
}

/**
 * Formats a type for display and maps spans of the printed type onto the
 * result. Spans that do not cover a type node map to `undefined`.
 */
export async function prettyTypeWithSpans(
  type: string,
  spans: TextSpan[],
): Promise<{prettyType: string; spans: (TextSpan | undefined)[]}> {
  const formatted = await formatCached(type, defaultPrintWidth)
  const removed: number[] = []
  for (
    let index = formatted.indexOf(namedParametersLabel);
    index >= 0;
    index = formatted.indexOf(namedParametersLabel, index + 1)
  ) {
    removed.push(index)
  }
  const shift = (position: number) =>
    position -
    removed.filter((index) => index < position).length *
      namedParametersLabel.length
  return {
    prettyType: withoutNamedParameters(formatted),
    spans: mapSpans(type, formatted, spans).map(
      (span) => span && {end: shift(span.end), start: shift(span.start)},
    ),
  }
}
