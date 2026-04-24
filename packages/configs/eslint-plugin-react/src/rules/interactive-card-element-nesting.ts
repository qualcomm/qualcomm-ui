// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils"

import {getAttributeValue, getJsxElementName, isQuiPackage} from "./utils"

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/qualcomm/qualcomm-ui/tree/main/packages/configs/eslint-plugin-react#${name}`,
)

const NATIVE_INTERACTIVE_ELEMENTS = new Set([
  "a",
  "button",
  "details",
  "input",
  "select",
  "textarea",
])

const QUI_INTERACTIVE_COMPONENTS = new Set([
  "Button",
  "Card.Button",
  "Card.Link",
  "Checkbox",
  "Combobox",
  "IconButton",
  "InlineIconButton",
  "Link",
  "Menu.Button",
  "Menu.IconButton",
  "Menu.InlineIconButton",
  "NumberInput",
  "PasswordInput",
  "Radio",
  "Select",
  "Switch",
  "TextInput",
])

type MessageIds = "noInteractiveChildren"

export const interactiveCardElementNesting = createRule<[], MessageIds>({
  create(context) {
    const importedCard = new Map<string, string>()
    const importedQuiInteractive = new Map<string, string>()
    const namespaceImports = new Set<string>()

    function hasInteractiveProp(
      attributes: TSESTree.JSXOpeningElement["attributes"],
    ): boolean {
      for (const attr of attributes) {
        if (
          attr.type !== AST_NODE_TYPES.JSXAttribute ||
          attr.name.type !== AST_NODE_TYPES.JSXIdentifier ||
          attr.name.name !== "interactive"
        ) {
          continue
        }
        if (!attr.value) {
          return true
        }
        const value = getAttributeValue(attr)
        return value !== false
      }
      return false
    }

    function getElementDisplayName(
      name: TSESTree.JSXOpeningElement["name"],
    ): string {
      if (name.type === AST_NODE_TYPES.JSXIdentifier) {
        const originalName = importedQuiInteractive.get(name.name)
        return originalName ?? name.name
      }
      if (name.type === AST_NODE_TYPES.JSXMemberExpression) {
        if (name.object.type === AST_NODE_TYPES.JSXIdentifier) {
          return `${name.object.name}.${name.property.name}`
        }
      }
      return "unknown"
    }

    function isInteractiveElement(
      openingElement: TSESTree.JSXOpeningElement,
    ): boolean {
      const {identifier, namespace, property} = getJsxElementName(
        openingElement.name,
      )

      if (identifier && !property && !namespace) {
        if (NATIVE_INTERACTIVE_ELEMENTS.has(identifier)) {
          return true
        }
        if (importedQuiInteractive.has(identifier)) {
          return true
        }
      }

      if (identifier && property && !namespace) {
        if (namespaceImports.has(identifier)) {
          if (QUI_INTERACTIVE_COMPONENTS.has(property)) {
            return true
          }
        }

        if (importedCard.has(identifier)) {
          const fullName = `${importedCard.get(identifier)}.${property}`
          if (QUI_INTERACTIVE_COMPONENTS.has(fullName)) {
            return true
          }
        }
      }

      return false
    }

    function checkRenderPropJsxElement(jsxElement: TSESTree.JSXElement): void {
      if (isInteractiveElement(jsxElement.openingElement)) {
        context.report({
          data: {
            elementName: getElementDisplayName(jsxElement.openingElement.name),
          },
          messageId: "noInteractiveChildren",
          node: jsxElement.openingElement,
        })
      }
    }

    function checkRenderProps(
      attributes: TSESTree.JSXOpeningElement["attributes"],
    ): void {
      for (const attr of attributes) {
        if (
          attr.type !== AST_NODE_TYPES.JSXAttribute ||
          !attr.name ||
          attr.name.type !== AST_NODE_TYPES.JSXIdentifier ||
          attr.name.name !== "render"
        ) {
          continue
        }

        if (
          !attr.value ||
          attr.value.type !== AST_NODE_TYPES.JSXExpressionContainer
        ) {
          continue
        }

        const expression = attr.value.expression

        if (expression.type === AST_NODE_TYPES.JSXElement) {
          checkRenderPropJsxElement(expression)
        }

        if (
          expression.type === AST_NODE_TYPES.ArrowFunctionExpression &&
          expression.body.type === AST_NODE_TYPES.JSXElement
        ) {
          checkRenderPropJsxElement(expression.body)
        }
      }
    }

    function findInteractiveDescendants(
      children: TSESTree.JSXElement["children"],
    ): void {
      for (const child of children) {
        if (child.type === AST_NODE_TYPES.JSXElement) {
          if (isInteractiveElement(child.openingElement)) {
            context.report({
              data: {
                elementName: getElementDisplayName(child.openingElement.name),
              },
              messageId: "noInteractiveChildren",
              node: child.openingElement,
            })
          }

          checkRenderProps(child.openingElement.attributes)
          findInteractiveDescendants(child.children)
        } else if (child.type === AST_NODE_TYPES.JSXFragment) {
          findInteractiveDescendants(child.children)
        }
      }
    }

    return {
      ImportDeclaration(node) {
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
            const localName = specifier.local.name

            if (importedName === "Card") {
              importedCard.set(localName, importedName)
            }
            if (QUI_INTERACTIVE_COMPONENTS.has(importedName)) {
              importedQuiInteractive.set(localName, importedName)
            }
          } else if (
            specifier.type === AST_NODE_TYPES.ImportNamespaceSpecifier
          ) {
            namespaceImports.add(specifier.local.name)
          }
        }
      },

      JSXOpeningElement(node) {
        const {identifier, namespace, property} = getJsxElementName(node.name)

        let isCardRoot = false

        if (identifier && property === "Root" && !namespace) {
          if (importedCard.has(identifier)) {
            isCardRoot = true
          }
        }

        if (
          identifier &&
          property === "Root" &&
          namespace &&
          namespaceImports.has(namespace) &&
          identifier === "Card"
        ) {
          isCardRoot = true
        }

        if (!isCardRoot || !hasInteractiveProp(node.attributes)) {
          return
        }

        const parent = node.parent
        if (!parent || parent.type !== AST_NODE_TYPES.JSXElement) {
          return
        }

        findInteractiveDescendants(parent.children)
      },
    }
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        "Disallow interactive elements nested inside Card.Root with the interactive prop.",
    },
    messages: {
      noInteractiveChildren:
        "{{elementName}} is an interactive element and should not be nested inside an interactive Card. This violates web standards. You should not nest interactive elements.",
    },
    schema: [],
    type: "problem",
  },
  name: "interactive-card-element-nesting",
})
