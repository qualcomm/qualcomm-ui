// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {AST_NODE_TYPES, type TSESTree} from "@typescript-eslint/utils"

import {
  createRule,
  getAttributeValue,
  getJsxElementName,
  hasValidAriaLabel,
  isQuiPackage,
} from "./utils.js"

const INPUT_COMPONENTS: {
  /**
   * The name of the composite element on the component that should receive the
   * aria-* attributes.
   */
  compositeElementName: string
  /**
   * The name of the composite element's props prop on the component that
   * should receive the aria-* attributes.
   */
  compositeElementProps: string
  name: string
}[] = [
  {
    compositeElementName: "Input",
    compositeElementProps: "inputProps",
    name: "TextInput",
  },
  {
    compositeElementName: "Input",
    compositeElementProps: "inputProps",
    name: "NumberInput",
  },
  {
    compositeElementName: "Input",
    compositeElementProps: "inputProps",
    name: "PasswordInput",
  },
  {
    compositeElementName: "Control",
    compositeElementProps: "controlProps",
    name: "Select",
  },
  {
    compositeElementName: "Control",
    compositeElementProps: "inputProps",
    name: "Combobox",
  },
  {
    compositeElementName: "HiddenInput",
    compositeElementProps: "hiddenInputProps",
    name: "Switch",
  },
  {
    compositeElementName: "HiddenInput",
    compositeElementProps: "hiddenInputProps",
    name: "Checkbox",
  },
  {
    compositeElementName: "HiddenInput",
    compositeElementProps: "hiddenInputProps",
    name: "Radio",
  },
]

type MessageIds = "missingLabel" | "missingLabelChild"

function hasLabelProp(
  attributes: (TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute)[],
): boolean {
  for (const attr of attributes) {
    if (attr.type !== AST_NODE_TYPES.JSXAttribute || !attr.name) {
      continue
    }
    const attrName =
      attr.name.type === AST_NODE_TYPES.JSXIdentifier ? attr.name.name : null

    if (attrName === "label") {
      const value = getAttributeValue(attr)
      if (value !== null && value !== "") {
        return true
      }
    }
  }
  return false
}

function hasAriaLabelInCompositeProps(
  attributes: (TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute)[],
  compositeElementProps: string,
): boolean {
  for (const attr of attributes) {
    if (attr.type !== AST_NODE_TYPES.JSXAttribute || !attr.name) {
      continue
    }
    const attrName =
      attr.name.type === AST_NODE_TYPES.JSXIdentifier ? attr.name.name : null

    if (attrName === compositeElementProps && attr.value) {
      if (
        attr.value.type === AST_NODE_TYPES.JSXExpressionContainer &&
        attr.value.expression.type === AST_NODE_TYPES.ObjectExpression
      ) {
        for (const prop of attr.value.expression.properties) {
          if (prop.type === AST_NODE_TYPES.Property && prop.key) {
            const keyName =
              prop.key.type === AST_NODE_TYPES.Identifier
                ? prop.key.name
                : prop.key.type === AST_NODE_TYPES.Literal
                  ? String(prop.key.value)
                  : null

            if (
              keyName === "aria-label" ||
              keyName === "aria-labelledby" ||
              keyName === "ariaLabel" ||
              keyName === "ariaLabelledby"
            ) {
              if (prop.value.type === AST_NODE_TYPES.Literal) {
                const val = prop.value.value
                if (typeof val === "string" && val !== "") {
                  return true
                }
              } else if (prop.value.type === AST_NODE_TYPES.Identifier) {
                return true
              } else if (
                prop.value.type === AST_NODE_TYPES.TemplateLiteral ||
                prop.value.type === AST_NODE_TYPES.CallExpression
              ) {
                return true
              }
            }
          }
        }
      }
    }
  }
  return false
}

function isLabelComponent(
  jsxElement: TSESTree.JSXElement,
  localName: string,
  baseComponentName: string,
  namespaceImports: Set<string>,
): boolean {
  const elementName = jsxElement.openingElement.name

  if (elementName.type === AST_NODE_TYPES.JSXMemberExpression) {
    const objectName =
      elementName.object.type === AST_NODE_TYPES.JSXIdentifier
        ? elementName.object.name
        : null
    const propertyName = elementName.property.name

    if (objectName === localName && propertyName === "Label") {
      return true
    }

    if (
      elementName.object.type === AST_NODE_TYPES.JSXMemberExpression &&
      elementName.object.object.type === AST_NODE_TYPES.JSXIdentifier
    ) {
      const nsName = elementName.object.object.name
      const componentPart = elementName.object.property.name
      if (
        namespaceImports.has(nsName) &&
        componentPart === baseComponentName &&
        propertyName === "Label"
      ) {
        return true
      }
    }
  }

  return false
}

const INPUT_CHILD_NAMES = ["HiddenInput", "Input"]

function isLabeledInputComponent(
  jsxElement: TSESTree.JSXElement,
  localName: string,
  baseComponentName: string,
  namespaceImports: Set<string>,
): boolean {
  const elementName = jsxElement.openingElement.name
  if (elementName.type !== AST_NODE_TYPES.JSXMemberExpression) {
    return false
  }

  const objectName =
    elementName.object.type === AST_NODE_TYPES.JSXIdentifier
      ? elementName.object.name
      : null
  const propertyName = elementName.property.name

  const isInputChild =
    (objectName === localName && INPUT_CHILD_NAMES.includes(propertyName)) ||
    (elementName.object.type === AST_NODE_TYPES.JSXMemberExpression &&
      elementName.object.object.type === AST_NODE_TYPES.JSXIdentifier &&
      namespaceImports.has(elementName.object.object.name) &&
      elementName.object.property.name === baseComponentName &&
      INPUT_CHILD_NAMES.includes(propertyName))

  return isInputChild && hasValidAriaLabel(jsxElement.openingElement.attributes)
}

function findLabeledInputRecursive(
  children: TSESTree.JSXElement["children"],
  localName: string,
  baseComponentName: string,
  namespaceImports: Set<string>,
): boolean {
  for (const child of children) {
    if (child.type === AST_NODE_TYPES.JSXElement) {
      if (
        isLabeledInputComponent(
          child,
          localName,
          baseComponentName,
          namespaceImports,
        )
      ) {
        return true
      }
      if (
        findLabeledInputRecursive(
          child.children,
          localName,
          baseComponentName,
          namespaceImports,
        )
      ) {
        return true
      }
    } else if (child.type === AST_NODE_TYPES.JSXFragment) {
      if (
        findLabeledInputRecursive(
          child.children,
          localName,
          baseComponentName,
          namespaceImports,
        )
      ) {
        return true
      }
    }
  }
  return false
}

function hasLabeledInputChild(
  node: TSESTree.JSXOpeningElement,
  localName: string,
  baseComponentName: string,
  namespaceImports: Set<string>,
): boolean {
  const parent = node.parent
  if (!parent || parent.type !== AST_NODE_TYPES.JSXElement) {
    return false
  }

  return findLabeledInputRecursive(
    parent.children,
    localName,
    baseComponentName,
    namespaceImports,
  )
}

function findLabelComponentRecursive(
  children: TSESTree.JSXElement["children"],
  localName: string,
  baseComponentName: string,
  namespaceImports: Set<string>,
): boolean {
  for (const child of children) {
    if (child.type === AST_NODE_TYPES.JSXElement) {
      if (
        isLabelComponent(child, localName, baseComponentName, namespaceImports)
      ) {
        return true
      }
      if (
        findLabelComponentRecursive(
          child.children,
          localName,
          baseComponentName,
          namespaceImports,
        )
      ) {
        return true
      }
    } else if (child.type === AST_NODE_TYPES.JSXFragment) {
      if (
        findLabelComponentRecursive(
          child.children,
          localName,
          baseComponentName,
          namespaceImports,
        )
      ) {
        return true
      }
    }
  }
  return false
}

function hasLabelChild(
  node: TSESTree.JSXOpeningElement,
  baseComponentName: string,
  localName: string,
  namespaceImports: Set<string>,
): boolean {
  const parent = node.parent
  if (!parent || parent.type !== AST_NODE_TYPES.JSXElement) {
    return false
  }

  return findLabelComponentRecursive(
    parent.children,
    localName,
    baseComponentName,
    namespaceImports,
  )
}

export const inputLabelAssociation: ReturnType<
  typeof createRule<[], MessageIds>
> = createRule<[], MessageIds>({
  create(context) {
    const importedComponents = new Map<string, string>()
    const namespaceImports = new Set<string>()

    return {
      ImportDeclaration(node) {
        const source = node.source.value
        if (typeof source !== "string" || !isQuiPackage(source)) {
          return
        }

        for (const specifier of node.specifiers) {
          if (specifier.type === AST_NODE_TYPES.ImportSpecifier) {
            const importedName =
              specifier.imported.type === AST_NODE_TYPES.Identifier
                ? specifier.imported.name
                : specifier.imported.value
            const localName = specifier.local.name
            if (INPUT_COMPONENTS.find(({name}) => name === importedName)) {
              importedComponents.set(localName, importedName)
            }
          } else if (
            specifier.type === AST_NODE_TYPES.ImportNamespaceSpecifier
          ) {
            namespaceImports.add(specifier.local.name)
          }
        }
      },

      JSXOpeningElement(node) {
        const {identifier, namespace, property} = getJsxElementName(node.name)
        let originalName: string | null = null
        let localName: string | null = null
        let isCompoundRoot = false

        if (identifier && !property && importedComponents.has(identifier)) {
          originalName = importedComponents.get(identifier)!
          localName = identifier
        } else if (
          identifier &&
          property === "Root" &&
          !namespace &&
          importedComponents.has(identifier)
        ) {
          originalName = importedComponents.get(identifier)!
          localName = identifier
          isCompoundRoot = true
        } else if (
          identifier &&
          property &&
          property !== "Root" &&
          !namespace &&
          namespaceImports.has(identifier) &&
          INPUT_COMPONENTS.find(({name}) => name === property)
        ) {
          originalName = property
          localName = property
        } else if (
          namespace &&
          identifier &&
          property === "Root" &&
          namespaceImports.has(namespace) &&
          INPUT_COMPONENTS.find(({name}) => name === identifier)
        ) {
          originalName = identifier
          localName = identifier
          isCompoundRoot = true
        }

        if (!originalName || !localName) {
          return
        }

        if (isCompoundRoot) {
          if (hasLabelChild(node, originalName, localName, namespaceImports)) {
            return
          }
          if (
            hasLabeledInputChild(
              node,
              localName,
              originalName,
              namespaceImports,
            )
          ) {
            return
          }
        } else {
          if (hasLabelProp(node.attributes)) {
            return
          }
          if (hasValidAriaLabel(node.attributes)) {
            return
          }
          const component = INPUT_COMPONENTS.find(
            ({name}) => name === originalName,
          )!
          if (
            hasAriaLabelInCompositeProps(
              node.attributes,
              component.compositeElementProps,
            )
          ) {
            return
          }
        }

        const component = INPUT_COMPONENTS.find(
          ({name}) => name === originalName,
        )!

        context.report({
          data: {
            componentName: originalName,
            compositeElementName: component.compositeElementName,
            compositeElementProps: component.compositeElementProps,
          },
          messageId: isCompoundRoot ? "missingLabelChild" : "missingLabel",
          node,
        })
      },
    }
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        "Enforce that form input components have proper label association for accessibility",
    },
    messages: {
      missingLabel:
        "{{componentName}} must have a non-empty label prop or aria-label/aria-labelledby attribute",
      missingLabelChild:
        "{{componentName}}.Root must have a non-empty {{componentName}}.Label child or aria-label/aria-labelledby on {{componentName}}.{{compositeElementName}} for accessibility",
    },
    schema: [],
    type: "problem",
  },
  name: "input-label-association",
})
