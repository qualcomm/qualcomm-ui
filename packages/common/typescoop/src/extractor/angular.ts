// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import ts from "typescript"

export type AngularGroup = "input" | "output"

export interface AngularMember {
  group?: AngularGroup
  /**
   * The binding name when it differs from the member name, from an `alias`
   * option or a structural directive's microsyntax.
   */
  publicName?: string
  required: boolean
}

export function getDecorators(node: ts.Node | undefined): string[] {
  if (!node || !ts.canHaveDecorators(node)) {
    return []
  }
  return (ts.getDecorators(node) ?? []).map((decorator) => decorator.getText())
}

/**
 * Classes with these decorators are documented as Angular entities, with their
 * members grouped into inputs, outputs, and public methods.
 */
const angularEntityDecorators = ["Component", "Directive", "NgModule"]

export function isAngularEntity(node: ts.Node | undefined): boolean {
  return (
    !!node &&
    angularEntityDecorators.some((name) => !!decoratorCall(node, name))
  )
}

function decoratorCall(
  node: ts.Node,
  name: string,
): ts.CallExpression | undefined {
  if (!ts.canHaveDecorators(node)) {
    return undefined
  }
  for (const decorator of ts.getDecorators(node) ?? []) {
    const expression = decorator.expression
    if (
      ts.isCallExpression(expression) &&
      ts.isIdentifier(expression.expression) &&
      expression.expression.text === name
    ) {
      return expression
    }
  }
  return undefined
}

function objectProperty(
  node: ts.Expression | undefined,
  name: string,
): ts.Expression | undefined {
  if (!node || !ts.isObjectLiteralExpression(node)) {
    return undefined
  }
  for (const property of node.properties) {
    if (
      ts.isPropertyAssignment(property) &&
      ts.isIdentifier(property.name) &&
      property.name.text === name
    ) {
      return property.initializer
    }
  }
  return undefined
}

function stringValue(node: ts.Expression | undefined): string | undefined {
  return node && ts.isStringLiteralLike(node) ? node.text : undefined
}

/**
 * Returns the attribute name of a directive whose selector is a single
 * attribute, such as `[renderCell]`.
 */
export function getStructuralSelector(
  declaration: ts.Declaration,
): string | undefined {
  const call = decoratorCall(declaration, "Directive")
  const selector = stringValue(objectProperty(call?.arguments[0], "selector"))
  return selector ? /^\[([A-Za-z]\w*)]$/.exec(selector)?.[1] : undefined
}

/**
 * Inputs of structural directives are bound through microsyntax, so
 * `renderCellComponentInput` is written as `componentInput` and `renderCell`
 * is written as `cell`.
 */
export function toMicrosyntaxName(selector: string, name: string): string {
  if (!name.startsWith(selector)) {
    return name
  }
  const suffix = name.slice(selector.length)
  if (!suffix) {
    return (/[A-Z][a-z]*/.exec(selector)?.[0] ?? selector).toLowerCase()
  }
  return suffix.charAt(0).toLowerCase() + suffix.slice(1)
}

interface SignalCall {
  fn: "input" | "model" | "output"
  options: ts.Expression | undefined
  required: boolean
  /**
   * The written value type, such as `Direction | undefined` in
   * `input<Direction | undefined>()`.
   */
  typeArgument: ts.TypeNode | undefined
}

export function getSignalCall(
  declaration: ts.Declaration,
): SignalCall | undefined {
  if (!ts.isPropertyDeclaration(declaration) || !declaration.initializer) {
    return undefined
  }
  const initializer = declaration.initializer
  if (!ts.isCallExpression(initializer)) {
    return undefined
  }
  const callee = initializer.expression
  if (ts.isIdentifier(callee)) {
    if (callee.text === "input" || callee.text === "model") {
      return {
        fn: callee.text,
        options: initializer.arguments[1],
        required: false,
        typeArgument: initializer.typeArguments?.[0],
      }
    }
    if (callee.text === "output") {
      return {
        fn: "output",
        options: initializer.arguments[0],
        required: false,
        typeArgument: initializer.typeArguments?.[0],
      }
    }
  }
  if (
    ts.isPropertyAccessExpression(callee) &&
    ts.isIdentifier(callee.expression) &&
    (callee.expression.text === "input" ||
      callee.expression.text === "model") &&
    callee.name.text === "required"
  ) {
    return {
      fn: callee.expression.text,
      options: initializer.arguments[0],
      required: true,
      typeArgument: initializer.typeArguments?.[0],
    }
  }
  return undefined
}

function signalGroupFromType(
  typeName: string | undefined,
): AngularGroup | undefined {
  if (!typeName) {
    return undefined
  }
  if (
    typeName.startsWith("InputSignal") ||
    typeName.startsWith("ModelSignal")
  ) {
    return "input"
  }
  return typeName.startsWith("OutputEmitterRef") ? "output" : undefined
}

/**
 * Classifies a class member as an Angular input or output from its decorators
 * or its signal initializer.
 */
export function analyzeMember(
  declaration: ts.Declaration,
  typeName: string | undefined,
): AngularMember {
  const inputCall = decoratorCall(declaration, "Input")
  if (inputCall) {
    const [arg] = inputCall.arguments
    const required = objectProperty(arg, "required")
    return {
      group: "input",
      publicName: stringValue(arg) ?? stringValue(objectProperty(arg, "alias")),
      required: required?.kind === ts.SyntaxKind.TrueKeyword,
    }
  }
  const outputCall = decoratorCall(declaration, "Output")
  if (outputCall) {
    return {
      group: "output",
      publicName: stringValue(outputCall.arguments[0]),
      required: false,
    }
  }
  const signal = getSignalCall(declaration)
  if (signal) {
    return {
      group: signal.fn === "output" ? "output" : "input",
      publicName: stringValue(objectProperty(signal.options, "alias")),
      required: signal.required,
    }
  }
  return {group: signalGroupFromType(typeName), required: false}
}
