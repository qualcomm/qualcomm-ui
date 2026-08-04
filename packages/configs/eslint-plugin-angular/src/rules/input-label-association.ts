// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createRule,
  getElementSourceLocation,
  hasDescendant,
  hasNonEmptyAttributeOrInput,
  hasNonEmptyAttributeOrPropertyInput,
  hasSelector,
  type TemplateNode,
} from "./utils.js"

interface InputComponent {
  controlAriaLabelInputs?: readonly string[]
  controlSelector: string
  labelSelector: string
  name: string
  rootSelector: string
  simpleAriaLabelInputs?: readonly string[]
  simpleSelector: string
}

const NATIVE_ARIA_LABEL_INPUTS = ["aria-label", "aria-labelledby"] as const

const INPUT_COMPONENTS: readonly InputComponent[] = [
  {
    controlSelector: "q-text-input-input",
    labelSelector: "q-text-input-label",
    name: "q-text-input",
    rootSelector: "q-text-input-root",
    simpleAriaLabelInputs: NATIVE_ARIA_LABEL_INPUTS,
    simpleSelector: "q-text-input",
  },
  {
    controlSelector: "q-number-input-input",
    labelSelector: "q-number-input-label",
    name: "q-number-input",
    rootSelector: "q-number-input-root",
    simpleAriaLabelInputs: NATIVE_ARIA_LABEL_INPUTS,
    simpleSelector: "q-number-input",
  },
  {
    controlSelector: "q-password-input-input",
    labelSelector: "q-password-input-label",
    name: "q-password-input",
    rootSelector: "q-password-input-root",
    simpleAriaLabelInputs: NATIVE_ARIA_LABEL_INPUTS,
    simpleSelector: "q-password-input",
  },
  {
    controlSelector: "q-select-control",
    labelSelector: "q-select-label",
    name: "q-select",
    rootSelector: "q-select-root",
    simpleAriaLabelInputs: NATIVE_ARIA_LABEL_INPUTS,
    simpleSelector: "q-select",
  },
  {
    controlAriaLabelInputs: NATIVE_ARIA_LABEL_INPUTS,
    controlSelector: "q-combobox-input",
    labelSelector: "q-combobox-label",
    name: "q-combobox",
    rootSelector: "q-combobox-root",
    simpleAriaLabelInputs: NATIVE_ARIA_LABEL_INPUTS,
    simpleSelector: "q-combobox",
  },
  {
    controlSelector: "q-switch-hidden-input",
    labelSelector: "q-switch-label",
    name: "q-switch",
    rootSelector: "q-switch-root",
    simpleAriaLabelInputs: NATIVE_ARIA_LABEL_INPUTS,
    simpleSelector: "q-switch",
  },
  {
    controlSelector: "q-checkbox-hidden-input",
    labelSelector: "q-checkbox-label",
    name: "q-checkbox",
    rootSelector: "q-checkbox-root",
    simpleAriaLabelInputs: NATIVE_ARIA_LABEL_INPUTS,
    simpleSelector: "q-checkbox",
  },
  {
    controlSelector: "q-radio-hidden-input",
    labelSelector: "q-radio-label",
    name: "q-radio",
    rootSelector: "q-radio-root",
    simpleAriaLabelInputs: NATIVE_ARIA_LABEL_INPUTS,
    simpleSelector: "q-radio",
  },
]

type MessageIds = "missingLabel" | "missingLabelChild"

function hasLabelOnSimpleComponent(
  node: TemplateNode,
  component: InputComponent,
): boolean {
  return (
    hasNonEmptyAttributeOrInput(node, "label") ||
    hasSimpleAriaLabelInput(node, component) ||
    hasLabelChild(node, component) ||
    hasLabeledControlChild(node, component)
  )
}

function hasSimpleAriaLabelInput(
  node: TemplateNode,
  component: InputComponent,
): boolean {
  return (
    component.simpleAriaLabelInputs?.some((inputName) =>
      hasNonEmptyAttributeOrPropertyInput(node, inputName),
    ) ?? false
  )
}

function hasLabelChild(node: TemplateNode, component: InputComponent): boolean {
  return hasDescendant(node, (child) =>
    hasSelector(child, component.labelSelector),
  )
}

function hasLabeledControlChild(
  node: TemplateNode,
  component: InputComponent,
): boolean {
  return hasDescendant(
    node,
    (child) =>
      hasSelector(child, component.controlSelector) &&
      hasControlLabel(child, component),
  )
}

function hasControlLabel(
  node: TemplateNode,
  component: InputComponent,
): boolean {
  return (component.controlAriaLabelInputs ?? NATIVE_ARIA_LABEL_INPUTS).some(
    (inputName) => hasNonEmptyAttributeOrPropertyInput(node, inputName),
  )
}

export const inputLabelAssociation: ReturnType<
  typeof createRule<[], MessageIds>
> = createRule<[], MessageIds>({
  create(context) {
    return {
      Element(node: TemplateNode) {
        for (const component of INPUT_COMPONENTS) {
          if (hasSelector(node, component.rootSelector)) {
            if (
              hasLabelChild(node, component) ||
              hasLabeledControlChild(node, component)
            ) {
              return
            }

            context.report({
              data: {
                componentName: component.name,
                selector: component.controlSelector,
              },
              loc: getElementSourceLocation(context, node)!,
              messageId: "missingLabelChild",
            })
            return
          }

          if (!hasSelector(node, component.simpleSelector)) {
            continue
          }

          if (hasLabelOnSimpleComponent(node, component)) {
            return
          }

          context.report({
            data: {componentName: component.name},
            loc: getElementSourceLocation(context, node)!,
            messageId: "missingLabel",
          })
          return
        }
      },
    }
  },
  meta: {
    docs: {
      description:
        "Enforce that form input components have proper label association for accessibility",
    },
    messages: {
      missingLabel:
        "{{componentName}} must have a non-empty label, aria-label, or aria-labelledby input",
      missingLabelChild:
        "{{componentName}} compound usage must have a label child or aria-label/aria-labelledby on its {{selector}}",
    },
    schema: [],
    type: "problem",
  },
  name: "input-label-association",
})
