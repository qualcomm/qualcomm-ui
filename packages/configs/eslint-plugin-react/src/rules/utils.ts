// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils"

export const QUI_PACKAGE_PREFIXES = [
  "@qualcomm-ui/react/",
  "@qualcomm-ui/react-internal/",
] as const

export function isQuiPackage(source: string): boolean {
  return QUI_PACKAGE_PREFIXES.some((prefix) => source.startsWith(prefix))
}

export function getAttributeValue(
  attribute: TSESTree.JSXAttribute,
): unknown | null {
  if (!attribute.value) {
    return null
  }
  if (attribute.value.type === AST_NODE_TYPES.Literal) {
    return attribute.value.value
  }
  if (attribute.value.type === AST_NODE_TYPES.JSXExpressionContainer) {
    const expression = attribute.value.expression
    if (expression.type === AST_NODE_TYPES.Literal) {
      return expression.value
    }
    return expression
  }
  return null
}

export function hasValidAriaLabel(
  attributes: (TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute)[],
): boolean {
  for (const attr of attributes) {
    if (attr.type !== AST_NODE_TYPES.JSXAttribute || !attr.name) {
      continue
    }
    const attrName =
      attr.name.type === AST_NODE_TYPES.JSXIdentifier
        ? attr.name.name
        : attr.name.type === AST_NODE_TYPES.JSXNamespacedName
          ? `${attr.name.namespace.name}:${attr.name.name.name}`
          : null

    if (attrName === "aria-label" || attrName === "aria-labelledby") {
      const value = getAttributeValue(attr)
      if (value !== null && value !== "" && value !== undefined) {
        return true
      }
    }
  }
  return false
}

export function getJsxElementName(name: TSESTree.JSXOpeningElement["name"]): {
  identifier: string | null
  namespace: string | null
  property: string | null
} {
  if (name.type === AST_NODE_TYPES.JSXIdentifier) {
    return {identifier: name.name, namespace: null, property: null}
  }
  if (name.type === AST_NODE_TYPES.JSXMemberExpression) {
    const property = name.property.name
    if (name.object.type === AST_NODE_TYPES.JSXIdentifier) {
      return {identifier: name.object.name, namespace: null, property}
    }
    if (name.object.type === AST_NODE_TYPES.JSXMemberExpression) {
      if (name.object.object.type === AST_NODE_TYPES.JSXIdentifier) {
        return {
          identifier: name.object.property.name,
          namespace: name.object.object.name,
          property,
        }
      }
    }
  }
  return {identifier: null, namespace: null, property: null}
}

export function getJsxAttribute(
  attributes: (TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute)[],
  attributeName: string,
): TSESTree.JSXAttribute | null {
  for (const attr of attributes) {
    if (
      attr.type === AST_NODE_TYPES.JSXAttribute &&
      attr.name.type === AST_NODE_TYPES.JSXIdentifier &&
      attr.name.name === attributeName
    ) {
      return attr
    }
  }
  return null
}

export function getStaticStringAttributeValue(
  attributes: (TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute)[],
  attributeName: string,
): string | null {
  const attr = getJsxAttribute(attributes, attributeName)
  if (!attr) {
    return null
  }
  const value = getAttributeValue(attr)
  return typeof value === "string" ? value : null
}

export function trackQuiComponentImports(
  node: TSESTree.ImportDeclaration,
  componentNames: readonly string[],
  importedComponents: Map<string, string>,
  namespaceImports: Set<string>,
): void {
  const source = node.source.value
  if (typeof source !== "string" || !isQuiPackage(source)) {
    return
  }

  for (const specifier of node.specifiers) {
    if (specifier.type === AST_NODE_TYPES.ImportSpecifier) {
      const importedName =
        specifier.imported.type === AST_NODE_TYPES.Identifier
          ? specifier.imported.name
          : specifier.imported.value
      if (componentNames.includes(importedName)) {
        importedComponents.set(specifier.local.name, importedName)
      }
    } else if (specifier.type === AST_NODE_TYPES.ImportNamespaceSpecifier) {
      namespaceImports.add(specifier.local.name)
    }
  }
}

export function isTrackedQuiComponent(
  name: TSESTree.JSXOpeningElement["name"],
  componentName: string,
  importedComponents: Map<string, string>,
  namespaceImports: Set<string>,
  partName?: string,
): boolean {
  const {identifier, namespace, property} = getJsxElementName(name)

  if (partName) {
    if (
      identifier &&
      property === partName &&
      !namespace &&
      importedComponents.get(identifier) === componentName
    ) {
      return true
    }

    return Boolean(
      identifier &&
      property === partName &&
      namespace &&
      namespaceImports.has(namespace) &&
      identifier === componentName,
    )
  }

  if (
    identifier &&
    !property &&
    !namespace &&
    importedComponents.get(identifier) === componentName
  ) {
    return true
  }

  return Boolean(
    identifier &&
    property === componentName &&
    !namespace &&
    namespaceImports.has(identifier),
  )
}

export function forEachJsxChildElement(
  children: TSESTree.JSXElement["children"],
  callback: (child: TSESTree.JSXElement) => void,
): void {
  for (const child of children) {
    if (child.type === AST_NODE_TYPES.JSXElement) {
      callback(child)
      forEachJsxChildElement(child.children, callback)
    } else if (child.type === AST_NODE_TYPES.JSXFragment) {
      forEachJsxChildElement(child.children, callback)
    }
  }
}

export const createRule: ReturnType<typeof ESLintUtils.RuleCreator> =
  ESLintUtils.RuleCreator(
    (name) =>
      `https://github.com/qualcomm/qualcomm-ui/tree/main/packages/configs/eslint-plugin-angular#${name}`,
  )
