// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {basename} from "node:path"
import ts from "typescript"

import {getNodeComment, hasComment, type ParsedComment} from "./comments.js"
import type {ExtractorProgram} from "./program.js"

export type EntityKind =
  | "class"
  | "enum"
  | "function"
  | "interface"
  | "typeAlias"
  | "variable"

export interface Entity {
  comment: ParsedComment
  declaration: ts.Declaration
  kind: EntityKind
  name: string
  symbol: ts.Symbol
}

/**
 * Declaration kinds in order of preference, for symbols that merge several
 * declarations such as a function and a namespace.
 */
const kindPriority: [EntityKind, (node: ts.Node) => boolean][] = [
  ["class", ts.isClassDeclaration],
  ["interface", ts.isInterfaceDeclaration],
  ["typeAlias", ts.isTypeAliasDeclaration],
  ["enum", ts.isEnumDeclaration],
  ["function", ts.isFunctionDeclaration],
  ["variable", ts.isVariableDeclaration],
  ["variable", ts.isBindingElement],
]

/**
 * Variables and class fields that hold an untyped arrow function or function
 * expression are documented as functions, as TypeDoc does.
 */
export function isFunctionValued(declaration: ts.Node | undefined): boolean {
  if (
    !declaration ||
    !(
      ts.isVariableDeclaration(declaration) ||
      ts.isPropertyDeclaration(declaration)
    ) ||
    declaration.type ||
    !declaration.initializer
  ) {
    return false
  }
  const initializer = declaration.initializer
  return ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer)
}

function pickDeclaration(
  symbol: ts.Symbol,
): {declaration: ts.Declaration; kind: EntityKind} | undefined {
  for (const [kind, test] of kindPriority) {
    const declaration = symbol.declarations?.find(test)
    if (declaration) {
      return {
        declaration,
        kind:
          kind === "variable" && isFunctionValued(declaration)
            ? "function"
            : kind,
      }
    }
  }
  return undefined
}

/**
 * Declarations from dependencies are not documented, matching TypeDoc's
 * `excludeExternals`.
 */
export function isExternalDeclaration(declaration: ts.Declaration): boolean {
  return declaration.getSourceFile().fileName.includes("/node_modules/")
}

/**
 * Members inherited from dependencies, such as the DOM attributes of a props
 * interface, are left out.
 */
export function isExternalMember(member: ts.Symbol): boolean {
  const declarations = member.declarations ?? []
  return declarations.length > 0 && declarations.every(isExternalDeclaration)
}

export function isHidden(comment: ParsedComment): boolean {
  return comment.modifiers.has("@internal")
}

/**
 * Collects the exported declarations of every entry file. Later files win when
 * two different declarations share an export name.
 */
export function collectEntities({
  checker,
  entryFiles,
}: ExtractorProgram): Entity[] {
  const entities = new Map<string, Entity>()

  for (const sourceFile of entryFiles) {
    const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
    if (!moduleSymbol) {
      continue
    }
    for (const exported of checker.getExportsOfModule(moduleSymbol)) {
      const symbol =
        exported.flags & ts.SymbolFlags.Alias
          ? checker.getAliasedSymbol(exported)
          : exported
      const picked = pickDeclaration(symbol)
      if (!picked || isExternalDeclaration(picked.declaration)) {
        continue
      }

      const name =
        exported.name === "default"
          ? basename(picked.declaration.getSourceFile().fileName).replace(
              /\.(d\.)?[cm]?tsx?$/,
              "",
            )
          : exported.name

      if (entities.get(name)?.symbol === symbol) {
        continue
      }

      const comment = getNodeComment(picked.declaration)
      if (isHidden(comment)) {
        continue
      }
      // `@public` alone counts as a comment, otherwise an undescribed function
      // could never be documented with the `only-public` scope.
      if (
        picked.kind === "function" &&
        !hasComment(comment) &&
        !comment.modifiers.has("@public")
      ) {
        continue
      }

      entities.set(name, {...picked, comment, name, symbol})
    }
  }

  return [...entities.values()]
}
