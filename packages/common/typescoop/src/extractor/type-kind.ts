// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import ts from "typescript"

/**
 * The TypeDoc type kind names. The docs UI picks a renderer from these, so the
 * extractor emits the same values that TypeDoc did.
 */
export type TypeKind =
  | "array"
  | "conditional"
  | "indexedAccess"
  | "inferred"
  | "intersection"
  | "intrinsic"
  | "literal"
  | "mapped"
  | "namedTupleMember"
  | "optional"
  | "predicate"
  | "query"
  | "reference"
  | "reflection"
  | "rest"
  | "templateLiteral"
  | "tuple"
  | "typeOperator"
  | "union"

export function kindOfTypeNode(node: ts.TypeNode): TypeKind {
  switch (node.kind) {
    case ts.SyntaxKind.TypeReference:
    case ts.SyntaxKind.ExpressionWithTypeArguments:
    case ts.SyntaxKind.ImportType:
      return "reference"
    case ts.SyntaxKind.ArrayType:
      return "array"
    case ts.SyntaxKind.UnionType:
      return "union"
    case ts.SyntaxKind.IntersectionType:
      return "intersection"
    case ts.SyntaxKind.LiteralType:
      return "literal"
    case ts.SyntaxKind.FunctionType:
    case ts.SyntaxKind.ConstructorType:
    case ts.SyntaxKind.TypeLiteral:
      return "reflection"
    case ts.SyntaxKind.TupleType:
      return "tuple"
    case ts.SyntaxKind.TypeOperator:
      return "typeOperator"
    case ts.SyntaxKind.IndexedAccessType:
      return "indexedAccess"
    case ts.SyntaxKind.ConditionalType:
      return "conditional"
    case ts.SyntaxKind.MappedType:
      return "mapped"
    case ts.SyntaxKind.TemplateLiteralType:
      return "templateLiteral"
    case ts.SyntaxKind.TypeQuery:
      return "query"
    case ts.SyntaxKind.TypePredicate:
      return "predicate"
    case ts.SyntaxKind.InferType:
      return "inferred"
    case ts.SyntaxKind.NamedTupleMember:
      return "namedTupleMember"
    case ts.SyntaxKind.OptionalType:
      return "optional"
    case ts.SyntaxKind.RestType:
      return "rest"
    case ts.SyntaxKind.ParenthesizedType:
      return kindOfTypeNode((node as ts.ParenthesizedTypeNode).type)
    default:
      return "intrinsic"
  }
}

/**
 * @param ignoreAlias report the kind of an alias's body instead of
 * `reference`, for aliases that print as their body.
 */
export function kindOfType(
  type: ts.Type,
  checker: ts.TypeChecker,
  ignoreAlias = false,
): TypeKind {
  if (type.aliasSymbol && !ignoreAlias) {
    return "reference"
  }
  if (type.flags & ts.TypeFlags.Boolean) {
    return "intrinsic"
  }
  if (type.isUnion()) {
    return "union"
  }
  if (type.isIntersection()) {
    return "intersection"
  }
  if (type.flags & ts.TypeFlags.TypeParameter) {
    return "reference"
  }
  if (type.isLiteral() || type.flags & ts.TypeFlags.BooleanLiteral) {
    return "literal"
  }
  if (type.flags & ts.TypeFlags.TemplateLiteral) {
    return "templateLiteral"
  }
  if (type.flags & ts.TypeFlags.IndexedAccess) {
    return "indexedAccess"
  }
  if (type.flags & ts.TypeFlags.Conditional) {
    return "conditional"
  }
  if (type.flags & ts.TypeFlags.Index) {
    return "typeOperator"
  }
  if (type.flags & ts.TypeFlags.Object) {
    const objectType = type as ts.ObjectType
    if (checker.isArrayType(type)) {
      return "array"
    }
    if (checker.isTupleType(type)) {
      const target = (type as ts.TypeReference).target as ts.TupleType
      return target.readonly ? "typeOperator" : "tuple"
    }
    if (
      objectType.objectFlags &
      (ts.ObjectFlags.Reference |
        ts.ObjectFlags.Interface |
        ts.ObjectFlags.Class)
    ) {
      return "reference"
    }
    if (objectType.objectFlags & ts.ObjectFlags.Mapped) {
      return "mapped"
    }
    return "reflection"
  }
  return "intrinsic"
}

/**
 * Prefers the declared type node, which is what TypeDoc converted, and falls
 * back to the checker type for inferred declarations.
 */
export function kindOf(
  node: ts.TypeNode | undefined,
  type: ts.Type,
  checker: ts.TypeChecker,
): TypeKind {
  return node ? kindOfTypeNode(node) : kindOfType(type, checker)
}
