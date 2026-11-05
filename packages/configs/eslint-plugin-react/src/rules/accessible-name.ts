// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {AST_NODE_TYPES} from "@typescript-eslint/utils"

import {
  createRule,
  getJsxElementName,
  hasValidAriaLabel,
  isQuiPackage,
} from "./utils.js"

const COMPONENTS_REQUIRING_LABEL = [
  "IconButton",
  "InlineIconButton",
  "HeaderBarActionIconButton",
]

type MessageIds = "missingLabel"

export const accessibleName: ReturnType<typeof createRule<[], MessageIds>> =
  createRule<[], MessageIds>({
    create(context) {
      const importedComponents = new Map<string, string>()
      const namespaceImports = new Set<string>()

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
              if (COMPONENTS_REQUIRING_LABEL.includes(importedName)) {
                importedComponents.set(localName, importedName)
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
          let originalName: string | null = null

          if (identifier && !property && importedComponents.has(identifier)) {
            originalName = importedComponents.get(identifier)!
          } else if (
            identifier &&
            property &&
            !namespace &&
            namespaceImports.has(identifier) &&
            COMPONENTS_REQUIRING_LABEL.includes(property)
          ) {
            originalName = property
          }

          if (!originalName) {
            return
          }

          if (!hasValidAriaLabel(node.attributes)) {
            context.report({
              data: {componentName: originalName},
              messageId: "missingLabel",
              node,
            })
          }
        },
      }
    },
    defaultOptions: [],
    meta: {
      docs: {
        description:
          "Enforce that certain QUI components have an aria-label or aria-labelledby attribute for accessibility.",
      },
      messages: {
        missingLabel:
          "{{componentName}} must have an aria-label or aria-labelledby attribute for accessibility.",
      },
      schema: [],
      type: "problem",
    },
    name: "accessible-name",
  })
