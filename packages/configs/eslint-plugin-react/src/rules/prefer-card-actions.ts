// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {AST_NODE_TYPES, type TSESTree} from "@typescript-eslint/utils"

import {
  createRule,
  forEachJsxChildElement,
  isTrackedQuiComponent,
  trackQuiComponentImports,
} from "./utils.js"

type MessageIds = "preferCardButton" | "preferCardLink"

const TRACKED_COMPONENTS = ["Button", "Card", "Link"] as const

export const preferCardActions: ReturnType<typeof createRule<[], MessageIds>> =
  createRule<[], MessageIds>({
    create(context) {
      const importedComponents = new Map<string, string>()
      const namespaceImports = new Set<string>()
      const reported = new Set<TSESTree.JSXOpeningElement>()

      function report(
        node: TSESTree.JSXOpeningElement,
        messageId: MessageIds,
      ): void {
        if (reported.has(node)) {
          return
        }
        reported.add(node)
        context.report({messageId, node})
      }

      function checkElement(node: TSESTree.JSXOpeningElement): void {
        if (
          isTrackedQuiComponent(
            node.name,
            "Button",
            importedComponents,
            namespaceImports,
          )
        ) {
          report(node, "preferCardButton")
        }
        if (
          isTrackedQuiComponent(
            node.name,
            "Link",
            importedComponents,
            namespaceImports,
          )
        ) {
          report(node, "preferCardLink")
        }
      }

      return {
        ImportDeclaration(node) {
          trackQuiComponentImports(
            node,
            TRACKED_COMPONENTS,
            importedComponents,
            namespaceImports,
          )
        },

        JSXOpeningElement(node) {
          if (
            !isTrackedQuiComponent(
              node.name,
              "Card",
              importedComponents,
              namespaceImports,
              "Root",
            )
          ) {
            return
          }

          const parent = node.parent
          if (!parent || parent.type !== AST_NODE_TYPES.JSXElement) {
            return
          }

          forEachJsxChildElement(parent.children, (child) => {
            checkElement(child.openingElement)
          })
        },
      }
    },
    defaultOptions: [],
    meta: {
      docs: {
        description:
          "Prefer Card.Button and Card.Link for actions rendered inside Card.Root.",
      },
      messages: {
        preferCardButton:
          "Use Card.Button for button actions inside Card.Root.",
        preferCardLink: "Use Card.Link for link actions inside Card.Root.",
      },
      schema: [],
      type: "problem",
    },
    name: "prefer-card-actions",
  })
