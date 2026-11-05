// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createRule,
  hasDirective,
  hasValidAriaLabel,
  type TemplateNode,
} from "./utils.js"

const DIRECTIVES_REQUIRING_LABEL = [
  "q-icon-button",
  "q-inline-icon-button",
  "q-header-bar-action-icon-button",
] as const

type MessageIds = "missingLabel"

export const accessibleName: ReturnType<typeof createRule<[], MessageIds>> =
  createRule<[], MessageIds>({
    create(context) {
      const parserServices = context.sourceCode.parserServices as
        | {
            convertElementSourceSpanToLoc?: (
              context: unknown,
              node: unknown,
            ) => {
              end: {column: number; line: number}
              start: {column: number; line: number}
            }
          }
        | undefined

      if (!parserServices || !parserServices.convertElementSourceSpanToLoc) {
        return {}
      }

      const convertLoc = parserServices.convertElementSourceSpanToLoc

      return {
        Element(node: TemplateNode) {
          const matchedDirective = DIRECTIVES_REQUIRING_LABEL.find(
            (directive) => hasDirective(node, directive),
          )

          if (!matchedDirective) {
            return
          }

          if (!hasValidAriaLabel(node)) {
            context.report({
              data: {componentName: matchedDirective},
              loc: convertLoc(context, node),
              messageId: "missingLabel",
            })
          }
        },
      }
    },
    meta: {
      docs: {
        description:
          "Enforce that certain components have appropriate accessibility attributes",
      },
      messages: {
        missingLabel:
          "{{componentName}} must have an aria-label or aria-labelledby attribute for accessibility",
      },
      schema: [],
      type: "problem",
    },
    name: "accessible-name",
  })
