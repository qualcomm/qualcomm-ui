// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {AST_NODE_TYPES, type TSESTree} from "@typescript-eslint/utils"

import {createRule, getJsxElementName, isQuiPackage} from "./utils.js"

type MessageIds = "missingAlt"

function hasNonEmptyAlt(
  attributes: (TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute)[],
): boolean {
  for (const attr of attributes) {
    if (attr.type !== AST_NODE_TYPES.JSXAttribute || !attr.name) {
      continue
    }
    const attrName =
      attr.name.type === AST_NODE_TYPES.JSXIdentifier ? attr.name.name : null

    if (attrName === "alt") {
      if (!attr.value) {
        return false
      }
      if (attr.value.type === AST_NODE_TYPES.Literal) {
        return attr.value.value !== "" && attr.value.value !== null
      }
      if (attr.value.type === AST_NODE_TYPES.JSXExpressionContainer) {
        const expression = attr.value.expression
        if (expression.type === AST_NODE_TYPES.Literal) {
          return expression.value !== "" && expression.value !== null
        }
        return true
      }
      return true
    }
  }
  return false
}

export const avatarImageAlt: ReturnType<typeof createRule<[], MessageIds>> =
  createRule<[], MessageIds>({
    create(context) {
      const importedAvatar = new Map<string, string>()
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
              if (importedName === "Avatar") {
                importedAvatar.set(localName, importedName)
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

          let isAvatarImage = false

          if (identifier && property === "Image" && !namespace) {
            if (importedAvatar.has(identifier)) {
              isAvatarImage = true
            }
          }

          if (
            identifier &&
            property === "Image" &&
            namespace &&
            namespaceImports.has(namespace) &&
            identifier === "Avatar"
          ) {
            isAvatarImage = true
          }

          if (!isAvatarImage) {
            return
          }

          if (!hasNonEmptyAlt(node.attributes)) {
            context.report({
              messageId: "missingAlt",
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
          "Enforce that Avatar.Image components have an alt attribute for accessibility.",
      },
      messages: {
        missingAlt:
          "Avatar.Image must have an alt attribute for accessibility.",
      },
      schema: [],
      type: "problem",
    },
    name: "avatar-image-alt",
  })
