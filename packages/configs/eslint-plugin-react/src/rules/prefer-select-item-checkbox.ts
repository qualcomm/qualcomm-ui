// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {AST_NODE_TYPES, type TSESTree} from "@typescript-eslint/utils"

import {
  createRule,
  forEachJsxChildElement,
  getStaticStringAttributeValue,
  isTrackedQuiComponent,
  trackQuiComponentImports,
} from "./utils.js"

type MessageIds = "preferSelectItemCheckbox"

const TRACKED_COMPONENTS = ["Select"] as const

export const preferSelectItemCheckbox: ReturnType<
  typeof createRule<[], MessageIds>
> = createRule<[], MessageIds>({
  create(context) {
    const importedComponents = new Map<string, string>()
    const namespaceImports = new Set<string>()
    const reported = new Set<TSESTree.JSXOpeningElement>()

    function report(node: TSESTree.JSXOpeningElement): void {
      if (reported.has(node)) {
        return
      }
      reported.add(node)
      context.report({messageId: "preferSelectItemCheckbox", node})
    }

    function isSelectItemIndicator(node: TSESTree.JSXOpeningElement): boolean {
      return isTrackedQuiComponent(
        node.name,
        "Select",
        importedComponents,
        namespaceImports,
        "ItemIndicator",
      )
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
            "Select",
            importedComponents,
            namespaceImports,
            "Root",
          )
        ) {
          return
        }

        if (
          getStaticStringAttributeValue(
            node.attributes,
            "selectionIndicator",
          ) !== "checkbox"
        ) {
          return
        }

        const parent = node.parent
        if (!parent || parent.type !== AST_NODE_TYPES.JSXElement) {
          return
        }

        forEachJsxChildElement(parent.children, (child) => {
          if (isSelectItemIndicator(child.openingElement)) {
            report(child.openingElement)
          }
        })
      },
    }
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Prefer Select.ItemCheckbox when Select.Root uses selectionIndicator="checkbox".',
    },
    messages: {
      preferSelectItemCheckbox:
        'Use Select.ItemCheckbox when Select.Root has selectionIndicator="checkbox".',
    },
    schema: [],
    type: "problem",
  },
  name: "prefer-select-item-checkbox",
})
