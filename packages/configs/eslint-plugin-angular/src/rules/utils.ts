// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {ESLintUtils} from "@typescript-eslint/utils"

export const QUI_PACKAGE_PREFIXES = [
  "@qualcomm-ui/angular/",
  "@qualcomm-ui/angular-internal/",
] as const

export interface TemplateAttribute {
  name: string
  value?: string
}

export interface TemplateInput {
  keySpan?: {
    details?: string | null
  }
  name: string
  value?: {
    source?: string
  }
}

export interface TemplateNode {
  attributes: TemplateAttribute[]
  children?: TemplateNode[]
  inputs: TemplateInput[]
  name?: string
}

export function hasDirective(
  node: TemplateNode,
  directiveName: string,
): boolean {
  return node.attributes.some((attr) => attr.name === directiveName)
}

export function hasSelector(node: TemplateNode, selectorName: string): boolean {
  return node.name === selectorName || hasDirective(node, selectorName)
}

export function getStaticAttributeValue(
  node: TemplateNode,
  attributeName: string,
): string | null {
  const attribute = node.attributes.find((attr) => attr.name === attributeName)
  return attribute?.value ?? null
}

export function getInputSource(
  node: TemplateNode,
  inputName: string,
): string | null {
  const input = node.inputs.find((item) => item.name === inputName)
  return input?.value?.source ?? null
}

function isNonEmptyBoundValue(source: string | null): boolean {
  if (source === null) {
    return false
  }

  const value = source.trim()
  if (value === "''" || value === '""') {
    return false
  }

  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    return value.slice(1, -1).trim() !== ""
  }

  return value !== ""
}

export function hasNonEmptyAttributeOrInput(
  node: TemplateNode,
  attributeName: string,
): boolean {
  const staticValue = getStaticAttributeValue(node, attributeName)
  if (staticValue !== null) {
    return staticValue.trim() !== ""
  }

  return isNonEmptyBoundValue(getInputSource(node, attributeName))
}

export function hasNonEmptyAttributeOrPropertyInput(
  node: TemplateNode,
  attributeName: string,
): boolean {
  const staticValue = getStaticAttributeValue(node, attributeName)
  if (staticValue !== null) {
    return staticValue.trim() !== ""
  }

  const input = node.inputs.find(
    (item) =>
      item.name === attributeName &&
      item.keySpan?.details !== `attr.${attributeName}`,
  )

  return isNonEmptyBoundValue(input?.value?.source ?? null)
}

export function hasValidAriaLabel(node: TemplateNode): boolean {
  return (
    hasNonEmptyAttributeOrInput(node, "aria-label") ||
    hasNonEmptyAttributeOrInput(node, "aria-labelledby")
  )
}

export function forEachElementChild(
  children: TemplateNode[] | undefined,
  callback: (child: TemplateNode) => void,
): void {
  if (!children?.length) {
    return
  }

  for (const child of children) {
    if (!Array.isArray(child.attributes)) {
      continue
    }

    callback(child)
    forEachElementChild(child.children, callback)
  }
}

export function hasDescendant(
  node: TemplateNode,
  predicate: (child: TemplateNode) => boolean,
): boolean {
  let found = false

  forEachElementChild(node.children, (child) => {
    if (!found && predicate(child)) {
      found = true
    }
  })

  return found
}

export function hasStaticOrBoundStringValue(
  node: TemplateNode,
  inputName: string,
  expectedValue: string,
): boolean {
  if (getStaticAttributeValue(node, inputName) === expectedValue) {
    return true
  }

  const boundValue = getInputSource(node, inputName)?.trim()
  return (
    boundValue === `'${expectedValue}'` || boundValue === `"${expectedValue}"`
  )
}

export function getElementSourceLocation(
  context: Readonly<unknown>,
  node: TemplateNode,
): {
  end: {column: number; line: number}
  start: {column: number; line: number}
} | null {
  const sourceContext = context as {
    sourceCode?: {
      parserServices?: {
        convertElementSourceSpanToLoc?: (
          context: unknown,
          node: unknown,
        ) => {
          end: {column: number; line: number}
          start: {column: number; line: number}
        }
      }
    }
  }

  const convertLoc =
    sourceContext.sourceCode?.parserServices?.convertElementSourceSpanToLoc

  return convertLoc ? convertLoc(context, node) : null
}

export const createRule: ReturnType<typeof ESLintUtils.RuleCreator> =
  ESLintUtils.RuleCreator(
    (name) =>
      `https://github.com/qualcomm/qualcomm-ui/tree/main/packages/configs/eslint-plugin-angular#${name}`,
  )
