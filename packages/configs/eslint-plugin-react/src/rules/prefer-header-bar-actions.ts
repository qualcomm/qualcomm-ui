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
  | "preferHeaderBarActionButton"
  | "preferHeaderBarActionIconButton"

const TRACKED_COMPONENTS = ["Button", "HeaderBar", "IconButton"] as const

export const preferHeaderBarActions: ReturnType<
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
        report(node, "preferHeaderBarActionButton")
      }
      if (
        isTrackedQuiComponent(
          node.name,
          "IconButton",
          importedComponents,
          namespaceImports,
        )
      ) {
        report(node, "preferHeaderBarActionIconButton")
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
            "HeaderBar",
            importedComponents,
            namespaceImports,
            "ActionBar",
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
        "Prefer HeaderBar.ActionButton and HeaderBar.ActionIconButton inside HeaderBar.ActionBar.",
    },
    messages: {
      preferHeaderBarActionButton:
        "Use HeaderBar.ActionButton for button actions inside HeaderBar.ActionBar.",
      preferHeaderBarActionIconButton:
        "Use HeaderBar.ActionIconButton for icon actions inside HeaderBar.ActionBar.",
    },
    schema: [],
    type: "problem",
  },
  name: "prefer-header-bar-actions",
})
