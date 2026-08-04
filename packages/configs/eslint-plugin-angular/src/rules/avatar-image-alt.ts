// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createRule,
  getElementSourceLocation,
  hasNonEmptyAttributeOrInput,
  hasSelector,
  type TemplateNode,
} from "./utils.js"

type MessageIds = "missingAlt"

export const avatarImageAlt: ReturnType<typeof createRule<[], MessageIds>> & {
  name: string
} = createRule<[], MessageIds>({
  create(context) {
    return {
      Element(node: TemplateNode) {
        if (!hasSelector(node, "q-avatar-image")) {
          return
        }

        if (hasNonEmptyAttributeOrInput(node, "alt")) {
          return
        }

        context.report({
          loc: getElementSourceLocation(context, node)!,
          messageId: "missingAlt",
        })
      },
    }
  },
  meta: {
    docs: {
      description:
        "Enforce that q-avatar-image has an alt attribute for accessibility",
    },
    messages: {
      missingAlt: "q-avatar-image must have an alt attribute for accessibility",
    },
    schema: [],
    type: "problem",
  },
  name: "avatar-image-alt",
})
