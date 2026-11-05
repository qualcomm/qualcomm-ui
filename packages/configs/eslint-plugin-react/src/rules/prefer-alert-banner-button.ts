// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {AST_NODE_TYPES, type TSESTree} from "@typescript-eslint/utils"

import {
  createRule,
  forEachJsxChildElement,
  getJsxAttribute,
  isTrackedQuiComponent,
  trackQuiComponentImports,
} from "./utils.js"

type MessageIds = "preferAlertBannerButton"

const TRACKED_COMPONENTS = ["AlertBanner", "Button"] as const

export const preferAlertBannerButton: ReturnType<
  typeof createRule<[], MessageIds>
> = createRule<[], MessageIds>({
  create(context) {
    const importedComponents = new Map<string, string>()
    const namespaceImports = new Set<string>()
    const reported = new Set<TSESTree.JSXOpeningElement>()

    function isAlertBannerPart(
      node: TSESTree.JSXOpeningElement,
      partName: string,
    ): boolean {
      return isTrackedQuiComponent(
        node.name,
        "AlertBanner",
        importedComponents,
        namespaceImports,
        partName,
      )
    }

    function report(node: TSESTree.JSXOpeningElement): void {
      if (reported.has(node)) {
        return
      }
      reported.add(node)
      context.report({messageId: "preferAlertBannerButton", node})
    }

    function checkElement(node: TSESTree.JSXOpeningElement): void {
      if (
        isTrackedQuiComponent(
          node.name,
          "Button",
          importedComponents,
          namespaceImports,
        ) ||
        isAlertBannerPart(node, "ActionContainer")
      ) {
        report(node)
      }
    }

    function checkElementAndChildren(element: TSESTree.JSXElement): void {
      checkElement(element.openingElement)
      forEachJsxChildElement(element.children, (child) => {
        checkElement(child.openingElement)
      })
    }

    function checkActionProp(node: TSESTree.JSXOpeningElement): void {
      const action = getJsxAttribute(node.attributes, "action")
      if (
        !action?.value ||
        action.value.type !== AST_NODE_TYPES.JSXExpressionContainer ||
        action.value.expression.type !== AST_NODE_TYPES.JSXElement
      ) {
        return
      }
      checkElementAndChildren(action.value.expression)
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
        if (isAlertBannerPart(node, "ActionContainer")) {
          report(node)
          return
        }

        if (
          isTrackedQuiComponent(
            node.name,
            "AlertBanner",
            importedComponents,
            namespaceImports,
          )
        ) {
          checkActionProp(node)
          return
        }

        if (!isAlertBannerPart(node, "Root")) {
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
        "Prefer AlertBanner.Button for alert banner actions instead of generic Button or AlertBanner.ActionContainer.",
    },
    messages: {
      preferAlertBannerButton:
        "Use AlertBanner.Button for alert banner actions.",
    },
    schema: [],
    type: "problem",
  },
  name: "prefer-alert-banner-button",
})
