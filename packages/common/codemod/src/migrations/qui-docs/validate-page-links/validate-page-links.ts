// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Node, QuoteKind, type SourceFile, SyntaxKind} from "ts-morph"

import type {Codemod} from "../../types.js"
import {
  applyEdits,
  type ConfigEdit,
  type ConfigTransformResult,
  describeConfigResult,
  findProperty,
  getPropertyInsertion,
  getPropertyRemoval,
  getStatus,
  parseConfig,
  runConfigTransform,
} from "../config-object.js"

/**
 * Matches the quote style of the first string literal in the file.
 */
function quote(sourceFile: SourceFile, value: string): string {
  const literal = sourceFile.getFirstDescendantByKind(SyntaxKind.StringLiteral)
  const mark = literal?.getQuoteKind() === QuoteKind.Single ? "'" : '"'
  return `${mark}${value}${mark}`
}

/**
 * Replaces the removed `validatePageLinks` option with the `lint.brokenLinks`
 * rule. `validatePageLinks: false` becomes `lint: {brokenLinks: "off"}`, unless
 * `lint.brokenLinks` is already set, which took precedence. `true` was the
 * default, so it's removed. Edited objects aren't reformatted.
 */
export function transformValidatePageLinks(
  content: string,
  filePath = "qui-docs.config.ts",
): ConfigTransformResult {
  const sourceFile = parseConfig(content, filePath)
  const changed: string[] = []
  const manual: string[] = []
  const edits: ConfigEdit[] = []
  const off = `brokenLinks: ${quote(sourceFile, "off")}`

  for (const object of sourceFile.getDescendantsOfKind(
    SyntaxKind.ObjectLiteralExpression,
  )) {
    const prop = findProperty(object, "validatePageLinks")
    if (!prop) {
      continue
    }
    const line = prop.getStartLineNumber()
    const value = Node.isPropertyAssignment(prop)
      ? prop.getInitializer()
      : undefined

    if (value?.getKind() === SyntaxKind.TrueKeyword) {
      edits.push(getPropertyRemoval(content, prop))
      changed.push("remove validatePageLinks: true, the default")
      continue
    }
    if (value?.getKind() !== SyntaxKind.FalseKeyword) {
      manual.push(
        `replace validatePageLinks (line ${line}) with lint.brokenLinks`,
      )
      continue
    }

    const lint = findProperty(object, "lint")
    if (!lint) {
      edits.push({
        end: prop.getEnd(),
        start: prop.getStart(),
        text: `lint: {${off}}`,
      })
      changed.push(`replace validatePageLinks: false with lint: {${off}}`)
      continue
    }

    const lintValue = Node.isPropertyAssignment(lint)
      ? lint.getInitializer()
      : undefined
    if (!Node.isObjectLiteralExpression(lintValue)) {
      manual.push(
        `replace validatePageLinks (line ${line}) with lint.brokenLinks: "off"`,
      )
      continue
    }

    edits.push(getPropertyRemoval(content, prop))
    if (findProperty(lintValue, "brokenLinks")) {
      changed.push(
        "remove validatePageLinks: false, lint.brokenLinks is already set",
      )
    } else {
      edits.push(getPropertyInsertion(content, lintValue, off))
      changed.push(`move validatePageLinks: false to lint.${off}`)
    }
  }

  return {
    changed,
    content: applyEdits(content, edits),
    manual,
    status: getStatus(changed, manual),
  }
}

const PAST_TENSE: Record<string, string> = {
  move: "moved",
  remove: "removed",
  replace: "replaced",
}

export const validatePageLinks: Codemod<"@qualcomm-ui/mdx-vite"> = {
  name: "validate-page-links",
  noMatchMessage: "no validatePageLinks option found, nothing to change",
  run: (ctx) =>
    runConfigTransform(ctx, transformValidatePageLinks, (result) =>
      describeConfigResult(
        {
          ...result,
          changed: result.changed.map((change) =>
            ctx.dryRun
              ? `would ${change}`
              : change.replace(/^\w+/, (verb) => PAST_TENSE[verb] ?? verb),
          ),
        },
        "",
        "no validatePageLinks option found",
      ),
    ),
  title: "Replace validatePageLinks with the lint.brokenLinks rule",
  versions: {
    "@qualcomm-ui/mdx-vite": {from: 4, to: 5},
  },
}
