// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createRule, hasDirective, type TemplateNode} from "./utils.js"

const NATIVE_INTERACTIVE_ELEMENTS = new Set([
  "a",
  "button",
  "details",
  "input",
  "select",
  "textarea",
])

// Attribute directives that make an element interactive (applied via [q-*])
const QUI_INTERACTIVE_DIRECTIVES = new Set([
  "q-button",
  "q-card-button",
  "q-card-link",
  "q-checkbox",
  "q-checkbox-root",
  "q-combobox-root",
  "q-icon-button",
  "q-inline-icon-button",
  "q-link",
  "q-number-input-root",
  "q-password-input-root",
  "q-radio",
  "q-radio-group",
  "q-radio-root",
  "q-select-root",
  "q-slider-root",
  "q-switch",
  "q-switch-root",
  "q-text-area-root",
  "q-text-input-root",
])

// Element selectors for QUI components that are interactive (used as <q-*>)
const QUI_INTERACTIVE_ELEMENTS = new Set([
  "q-combobox",
  "q-number-input",
  "q-password-input",
  "q-select",
  "q-slider",
  "q-text-area",
  "q-text-input",
])

type MessageIds = "noInteractiveChildren"

function hasInteractiveAttribute(node: TemplateNode): boolean {
  return node.attributes.some((attr) => attr.name === "interactive")
}

function isElement(node: TemplateNode): boolean {
  return Array.isArray(node.attributes)
}

function isInteractiveElement(node: TemplateNode): boolean {
  if (node.name && NATIVE_INTERACTIVE_ELEMENTS.has(node.name)) {
    return true
  }

  if (node.name && QUI_INTERACTIVE_ELEMENTS.has(node.name)) {
    return true
  }

  if (!isElement(node)) {
    return false
  }

  for (const directive of QUI_INTERACTIVE_DIRECTIVES) {
    if (hasDirective(node, directive)) {
      return true
    }
  }

  return false
}

function getElementDisplayName(node: TemplateNode): string {
  if (isElement(node)) {
    for (const directive of QUI_INTERACTIVE_DIRECTIVES) {
      if (hasDirective(node, directive)) {
        return directive
      }
    }
  }
  return node.name ?? "unknown"
}

export const interactiveCardElementNesting: ReturnType<
  typeof createRule<[], MessageIds>
> = createRule<[], MessageIds>({
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

    function findInteractiveDescendants(children: TemplateNode[]): void {
      for (const child of children) {
        if (isInteractiveElement(child)) {
          context.report({
            data: {elementName: getElementDisplayName(child)},
            loc: convertLoc(context, child),
            messageId: "noInteractiveChildren",
          })
          // Don't recurse into children of an interactive element — its
          // internals (e.g. <input> inside q-text-input-root) are
          // implementation details, not separate violations.
          continue
        }

        if (child.children?.length) {
          findInteractiveDescendants(child.children)
        }
      }
    }

    return {
      Element(node: TemplateNode) {
        if (!hasDirective(node, "q-card")) {
          return
        }

        if (!hasInteractiveAttribute(node)) {
          return
        }

        if (node.children?.length) {
          findInteractiveDescendants(node.children)
        }
      },
    }
  },
  meta: {
    docs: {
      description:
        "Disallow interactive elements nested inside q-card with the interactive attribute",
    },
    messages: {
      noInteractiveChildren:
        "{{elementName}} is an interactive element and should not be nested inside an interactive Card. This violates web standards. You should not nest interactive elements",
    },
    schema: [],
    type: "problem",
  },
  name: "interactive-card-element-nesting",
})
