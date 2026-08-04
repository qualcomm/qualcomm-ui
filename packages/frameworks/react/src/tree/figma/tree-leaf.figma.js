// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=8859-910
// component=TreeLeaf

const figma = require("figma")

const instance = figma.selectedInstance

const variant = instance.getEnum("variant", {
  checkbox: "checkbox",
  icon: "icon",
})

const figmaSize = instance.getString("size")
const swapPropName = figmaSize === "sm" ? "iconXs" : "iconSm"

const iconInstance =
  variant === "icon" ? instance.getInstanceSwap(swapPropName) : undefined
const iconName = iconInstance ? toLucideName(iconInstance.name) : "FileCode"

const indicatorEl = variant === "icon" ? `<Tree.NodeIndicator />` : ""
const iconEl = variant === "icon" ? `<Tree.NodeIcon icon={${iconName}} />` : ""
const checkboxEl = variant === "checkbox" ? `<Tree.NodeCheckbox />` : ""
const nodeText = instance.getString("leafText") || "Leaf name"

const example = figma.code`
    <Tree.LeafNode>
      ${indicatorEl}${iconEl}${checkboxEl}
      <Tree.NodeText>${nodeText}</Tree.NodeText>
    </Tree.LeafNode>`

export default {
  example,
  id: "TreeLeaf",
  imports: [
    `import {Tree} from "@qualcomm-ui/react/tree"`,
    ...(variant === "icon" ? [`import {${iconName}} from "lucide-react"`] : []),
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
