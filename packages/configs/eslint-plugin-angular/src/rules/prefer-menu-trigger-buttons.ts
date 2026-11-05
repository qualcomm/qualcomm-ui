// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createRule,
  forEachElementChild,
  getElementSourceLocation,
  hasSelector,
  type TemplateNode,
} from "./utils.js"

type MessageIds = "preferMenuButton" | "preferMenuIconButton"

export const preferMenuTriggerButtons: ReturnType<
  typeof createRule<[], MessageIds>
> = createRule<[], MessageIds>({
  create(context) {
    const reported = new Set<TemplateNode>()

    function report(node: TemplateNode, messageId: MessageIds): void {
      if (reported.has(node)) {
        return
      }
      reported.add(node)

      context.report({
        loc: getElementSourceLocation(context, node)!,
        messageId,
      })
    }

    function checkElement(node: TemplateNode): void {
      if (hasSelector(node, "q-button")) {
        report(node, "preferMenuButton")
      }
      if (
        hasSelector(node, "q-icon-button") ||
        hasSelector(node, "q-inline-icon-button")
      ) {
        report(node, "preferMenuIconButton")
      }
    }

    return {
      Element(node: TemplateNode) {
        if (!hasSelector(node, "q-menu-trigger")) {
          return
        }

        forEachElementChild(node.children, checkElement)
      },
    }
  },
  meta: {
    docs: {
      description:
        "Prefer menu trigger-specific button components inside q-menu-trigger",
    },
    messages: {
      preferMenuButton: "Use q-menu-button inside q-menu-trigger",
      preferMenuIconButton: "Use q-menu-icon-button inside q-menu-trigger",
    },
    schema: [],
    type: "problem",
  },
  name: "prefer-menu-trigger-buttons",
})
