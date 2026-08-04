// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createRule,
  forEachElementChild,
  getElementSourceLocation,
  hasSelector,
  type TemplateNode,
} from "./utils.js"

type MessageIds = "preferCardButton" | "preferCardLink"

export const preferCardActions: ReturnType<typeof createRule<[], MessageIds>> =
  createRule<[], MessageIds>({
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
          report(node, "preferCardButton")
        }
        if (hasSelector(node, "q-link")) {
          report(node, "preferCardLink")
        }
      }

      return {
        Element(node: TemplateNode) {
          if (!hasSelector(node, "q-card")) {
            return
          }

          forEachElementChild(node.children, checkElement)
        },
      }
    },
    meta: {
      docs: {
        description:
          "Prefer q-card-button and q-card-link for actions rendered inside q-card",
      },
      messages: {
        preferCardButton: "Use q-card-button for button actions inside q-card",
        preferCardLink: "Use q-card-link for link actions inside q-card",
      },
      schema: [],
      type: "problem",
    },
    name: "prefer-card-actions",
  })
