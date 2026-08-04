// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createRule,
  forEachElementChild,
  getElementSourceLocation,
  hasSelector,
  type TemplateNode,
} from "./utils.js"

type MessageIds = "preferAlertBannerButton"

export const preferAlertBannerButton: ReturnType<
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
        messageId: "preferAlertBannerButton",
      })
    }

    function checkElement(node: TemplateNode): void {
      if (hasSelector(node, "q-alert-banner-action")) {
        report(node)
        return
      }

      if (hasSelector(node, "q-button")) {
        report(node)
      }
    }

    return {
      Element(node: TemplateNode) {
        if (hasSelector(node, "q-alert-banner-action")) {
          report(node)
          return
        }

        if (
          !hasSelector(node, "q-alert-banner") &&
          !hasSelector(node, "q-alert-banner-root")
        ) {
          return
        }

        forEachElementChild(node.children, checkElement)
      },
    }
  },
  meta: {
    docs: {
      description:
        "Prefer q-alert-banner-button for alert banner actions instead of generic q-button or q-alert-banner-action",
    },
    messages: {
      preferAlertBannerButton:
        "Use q-alert-banner-button for alert banner actions",
    },
    schema: [],
    type: "problem",
  },
  name: "prefer-alert-banner-button",
})
