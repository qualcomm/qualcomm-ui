// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createRule,
  forEachElementChild,
  getElementSourceLocation,
  hasSelector,
  hasStaticOrBoundStringValue,
  type TemplateNode,
} from "./utils.js"

type MessageIds = "preferSelectItemCheckbox"

export const preferSelectItemCheckbox: ReturnType<
  typeof createRule<[], MessageIds>
> = createRule<[], MessageIds>({
  create(context) {
    const reported = new Set<TemplateNode>()

    function report(node: TemplateNode): void {
      if (reported.has(node)) {
        return
      }
      reported.add(node)

      context.report({
        loc: getElementSourceLocation(context, node)!,
        messageId: "preferSelectItemCheckbox",
      })
    }

    return {
      Element(node: TemplateNode) {
        if (!hasSelector(node, "q-select-root")) {
          return
        }

        if (
          !hasStaticOrBoundStringValue(node, "selectionIndicator", "checkbox")
        ) {
          return
        }

        forEachElementChild(node.children, (child) => {
          if (!hasSelector(child, "q-select-item-indicator")) {
            return
          }

          report(child)
        })
      },
    }
  },
  meta: {
    docs: {
      description:
        'Prefer q-select-item-checkbox when q-select-root uses selectionIndicator="checkbox"',
    },
    messages: {
      preferSelectItemCheckbox:
        'Use q-select-item-checkbox when q-select-root has selectionIndicator="checkbox"',
    },
    schema: [],
    type: "problem",
  },
  name: "prefer-select-item-checkbox",
})
