// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {AST_NODE_TYPES, type TSESTree} from "@typescript-eslint/utils"

import {
  createRule,
  forEachJsxChildElement,
  isTrackedQuiComponent,
  trackQuiComponentImports,
} from "./utils.js"

type MessageIds =
  | "preferMenuButton"
  | "preferMenuIconButton"
  | "preferMenuInlineIconButton"

const TRACKED_COMPONENTS = [
  "Button",
  "IconButton",
  "InlineIconButton",
  "Menu",
] as const

export const preferMenuTriggerButtons: ReturnType<
  typeof createRule<[], MessageIds>
> = createRule<[], MessageIds>({
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
        report(node, "preferMenuButton")
      }
      if (
        isTrackedQuiComponent(
          node.name,
          "IconButton",
          importedComponents,
          namespaceImports,
        )
      ) {
        report(node, "preferMenuIconButton")
      }
      if (
        isTrackedQuiComponent(
          node.name,
          "InlineIconButton",
          importedComponents,
          namespaceImports,
        )
      ) {
        report(node, "preferMenuInlineIconButton")
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
            "Menu",
            importedComponents,
            namespaceImports,
            "Trigger",
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
        "Prefer Menu trigger-specific button components inside Menu.Trigger.",
    },
    messages: {
      preferMenuButton: "Use Menu.Button inside Menu.Trigger.",
      preferMenuIconButton: "Use Menu.IconButton inside Menu.Trigger.",
      preferMenuInlineIconButton:
        "Use Menu.InlineIconButton inside Menu.Trigger.",
    },
    schema: [],
    type: "problem",
  },
  name: "prefer-menu-trigger-buttons",
})
