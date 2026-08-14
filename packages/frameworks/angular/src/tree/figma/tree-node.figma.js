// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=8859-749
// component=Tree Branch Node

const figma = require("figma")

const instance = figma.selectedInstance

const variant = instance.getString("variant")
const nodeText = instance.getString("nodeText") || "Branch name"

const figmaSize = instance.getString("size")
const swapPropName = figmaSize === "sm" ? "iconXs" : "iconSm"

const iconInstance =
  variant === "icon" ? instance.getInstanceSwap(swapPropName) : undefined
const iconName = iconInstance ? toLucideName(iconInstance.name) : "FolderIcon"

const iconEl =
  variant === "icon" ? `<svg q-tree-node-icon qIcon="${iconName}"></svg>` : ""
const checkboxEl =
  variant === "checkbox" ? `<span q-tree-node-checkbox></span>` : ""

const iconImports =
  variant === "icon"
    ? [
        `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
        `import {Lucide${iconName}} from "@lucide/angular"`,
      ]
    : []

export default {
  example: figma.code`
    <div q-tree-branch-node>
      <div q-tree-branch-trigger></div>
      ${iconEl}${checkboxEl}
      <span q-tree-node-text>${nodeText}</span>
    </div>`,
  id: "TreeBranchNode",
  imports: [
    `import {TreeModule} from "@qualcomm-ui/angular/tree"`,
    ...iconImports,
  ],
  metadata: {nestable: true},
}

function toLucideName(figmaName) {
  return figmaName
    .replace(/^utl\//, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}
