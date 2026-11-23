// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import ts from "typescript"

import type {SerializedRef} from "@qualcomm-ui/typedoc-common"

import {isHidden} from "./collect.js"
import {getSymbolComment, toDisplayParts} from "./comments.js"
import {prettyDeclaration} from "./pretty.js"
import type {TypePrinter} from "./type-printer.js"

const namedTypeFlags =
  ts.SymbolFlags.Class |
  ts.SymbolFlags.Enum |
  ts.SymbolFlags.Interface |
  ts.SymbolFlags.TypeAlias

/**
 * TypeScript's lib and the `@types` packages, such as `HTMLElement` and
 * `ReactNode`. Their declarations are long, and readers know them.
 */
function isBuiltIn(symbol: ts.Symbol, program: ts.Program): boolean {
  return (symbol.declarations ?? []).every((declaration) => {
    const file = declaration.getSourceFile()
    return (
      program.isSourceFileDefaultLibrary(file) ||
      file.fileName.includes("/node_modules/@types/") ||
      file.fileName.includes("/node_modules/typescript/lib/")
    )
  })
}

/**
 * Documented types of every kind, and the type aliases of dependencies, such
 * as `DateValue`. Namespaced names are left out, since the docs UI looks refs
 * up by a single name.
 */
function isRef(
  symbol: ts.Symbol,
  printer: TypePrinter,
  program: ts.Program,
): boolean {
  return (
    !!(symbol.flags & namedTypeFlags) &&
    !printer.qualifiedName(symbol).includes(".") &&
    !isBuiltIn(symbol, program) &&
    (printer.isKnown(symbol) || !!(symbol.flags & ts.SymbolFlags.TypeAlias)) &&
    !isHidden(getSymbolComment(symbol))
  )
}

const inlineTagPattern =
  /\{@link(?:code|plain)?\s+([^\s|}]+)\s*\|?\s*([^}]*)\}/g

/**
 * Line breaks within a paragraph, except those before a list item.
 */
const softBreakPattern = /[ \t]*\n[ \t]*(?![ \t]|(?:[-*+]|\d+\.)\s)/g

/**
 * The first paragraph of a comment's summary, or `null` for members hidden from
 * the docs. Links show their label, since their targets are often long URLs.
 * The paragraph is joined into one line, and the formatted declaration wraps it
 * to the print width.
 */
function describeMember(member: ts.Symbol): string | null | undefined {
  const comment = getSymbolComment(member)
  if (isHidden(comment)) {
    return null
  }
  const paragraph = comment.summary
    .split(/\n\s*\n/)[0]
    .replace(
      inlineTagPattern,
      (_, target: string, label: string) => label.trim() || target,
    )
    .trim()
  if (!paragraph) {
    return undefined
  }
  // code blocks keep their lines as written.
  return paragraph.includes("```")
    ? paragraph
    : paragraph.replace(softBreakPattern, " ")
}

/**
 * Serializes the declarations of the named types that the printer printed by
 * name, by name. When two types share a name, a documented type wins over a
 * dependency's type, and otherwise the first printed type wins.
 */
export async function serializeRefs(
  printer: TypePrinter,
  program: ts.Program,
): Promise<Record<string, SerializedRef>> {
  const symbols = new Map<string, ts.Symbol>()
  for (const symbol of printer.namedSymbols()) {
    if (!isRef(symbol, printer, program)) {
      continue
    }
    const name = symbol.name
    const existing = symbols.get(name)
    if (!existing || (!printer.isKnown(existing) && printer.isKnown(symbol))) {
      symbols.set(name, symbol)
    }
  }

  const entries = await Promise.all(
    [...symbols].map(async ([name, symbol]) => {
      const declaration = printer.printDeclaration(symbol, describeMember)
      if (!declaration) {
        return undefined
      }
      const summary = getSymbolComment(symbol).summary
      const ref: SerializedRef = {
        prettyType: await prettyDeclaration(declaration),
        ...(summary ? {summary: toDisplayParts(summary)} : {}),
      }
      return [name, ref] as const
    }),
  )
  return Object.fromEntries(
    entries
      .filter((entry) => entry !== undefined)
      .sort(([a], [b]) => a.localeCompare(b)),
  )
}
