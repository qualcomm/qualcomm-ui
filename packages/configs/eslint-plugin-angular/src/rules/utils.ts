// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export const QUI_PACKAGE_PREFIXES = [
  "@qualcomm-ui/angular/",
  "@qualcomm-ui/angular-internal/",
] as const

export interface TemplateAttribute {
  name: string
  value?: string
}

export interface TemplateInput {
  name: string
}

export interface TemplateNode {
  attributes: TemplateAttribute[]
  children?: TemplateNode[]
  inputs: TemplateInput[]
  name?: string
}

export function hasDirective(
  node: TemplateNode,
  directiveName: string,
): boolean {
  return node.attributes.some((attr) => attr.name === directiveName)
}

export function hasValidAriaLabel(node: TemplateNode): boolean {
  for (const attr of node.attributes) {
    if (attr.name === "aria-label" || attr.name === "aria-labelledby") {
      if (attr.value && attr.value.trim() !== "") {
        return true
      }
    }
  }

  for (const input of node.inputs) {
    if (input.name === "aria-label" || input.name === "aria-labelledby") {
      return true
    }
  }

  return false
}
