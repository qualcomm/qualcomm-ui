// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils"

import {getJsxElementName, isQuiPackage} from "./utils"

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/qualcomm/qualcomm-ui/tree/main/packages/configs/eslint-plugin-react#${name}`,
)

const BUTTON_IMPORT_NAME = "Button"
const HEADER_BAR_IMPORT_NAME = "HeaderBar"
const REPLACEMENT_TAG = "HeaderBar.ActionButton"

type MessageIds = "noButtonInHeaderBar"

export const noButtonInHeaderBar = createRule<[], MessageIds>({
  create(context) {
    const quiButtonLocalNames = new Set<string>()
    const quiHeaderBarLocalNames = new Set<string>()
    const quiNamespaceImports = new Set<string>()

    function isQuiButtonElement(
      openingElement: TSESTree.JSXOpeningElement,
    ): boolean {
      const {identifier, namespace, property} = getJsxElementName(
        openingElement.name,
      )

      if (identifier && !property && !namespace) {
        return quiButtonLocalNames.has(identifier)
      }

      if (
        identifier &&
        property &&
        !namespace &&
        quiNamespaceImports.has(identifier) &&
        property === BUTTON_IMPORT_NAME
      ) {
        return true
      }

      return false
    }

    function isQuiHeaderBarAncestor(jsxElement: TSESTree.JSXElement): boolean {
      const {identifier, namespace, property} = getJsxElementName(
        jsxElement.openingElement.name,
      )

      if (identifier && !property && !namespace) {
        return quiHeaderBarLocalNames.has(identifier)
      }

      if (identifier && property && !namespace) {
        if (quiHeaderBarLocalNames.has(identifier) && property === "Root") {
          return true
        }
        if (
          quiNamespaceImports.has(identifier) &&
          property === HEADER_BAR_IMPORT_NAME
        ) {
          return true
        }
      }

      if (
        namespace &&
        identifier === HEADER_BAR_IMPORT_NAME &&
        property === "Root" &&
        quiNamespaceImports.has(namespace)
      ) {
        return true
      }

      return false
    }

    function hasHeaderBarAncestor(node: TSESTree.JSXElement): boolean {
      let current: TSESTree.Node | undefined = node.parent
      while (current) {
        if (current.type === AST_NODE_TYPES.JSXElement) {
          if (isQuiHeaderBarAncestor(current)) {
            return true
          }
        }
        current = current.parent
      }
      return false
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

            if (importedName === BUTTON_IMPORT_NAME) {
              quiButtonLocalNames.add(localName)
            }
            if (importedName === HEADER_BAR_IMPORT_NAME) {
              quiHeaderBarLocalNames.add(localName)
            }
          } else if (
            specifier.type === AST_NODE_TYPES.ImportNamespaceSpecifier
          ) {
            quiNamespaceImports.add(specifier.local.name)
          }
        }
      },

      JSXOpeningElement(node) {
        if (!isQuiButtonElement(node)) {
          return
        }

        const parent = node.parent
        if (!parent || parent.type !== AST_NODE_TYPES.JSXElement) {
          return
        }

        if (!hasHeaderBarAncestor(parent)) {
          return
        }

        context.report({
          fix(fixer) {
            const fixes = [fixer.replaceText(node.name, REPLACEMENT_TAG)]
            const closing = parent.closingElement
            if (closing) {
              fixes.push(fixer.replaceText(closing.name, REPLACEMENT_TAG))
            }
            return fixes
          },
          messageId: "noButtonInHeaderBar",
          node,
        })
      },
    }
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        "Use HeaderBar.ActionButton for action buttons inside HeaderBar. " +
        "HeaderBar.ActionButton wires the HeaderBar-specific size, density, and divider defaults.",
    },
    fixable: "code",
    messages: {
      noButtonInHeaderBar:
        "Use HeaderBar.ActionButton for action buttons inside HeaderBar. " +
        "Button misses the HeaderBar-specific size, density, and divider wiring.",
    },
    schema: [],
    type: "problem",
  },
  name: "no-button-in-header-bar",
})
