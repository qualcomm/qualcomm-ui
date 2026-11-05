// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=8859-749
// component=TreeBranch

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
const iconName = iconInstance ? toLucideName(iconInstance.name) : "FolderIcon"

const indicatorEl = variant === "icon" ? `<Tree.NodeIndicator />` : ""
const iconEl = variant === "icon" ? `<Tree.NodeIcon icon={${iconName}} />` : ""
const checkboxEl = variant === "checkbox" ? `<Tree.NodeCheckbox />` : ""
const nodeText = instance.getString("nodeText") || "Branch name"

const example = figma.code`
    <Tree.Branch>
      <Tree.BranchNode>
        ${indicatorEl}
        <Tree.BranchTrigger />
        ${iconEl}${checkboxEl}
        <Tree.NodeText>${nodeText}</Tree.NodeText>
      </Tree.BranchNode>
      <Tree.BranchContent>
        <Tree.BranchIndentGuide />
        {/* Child nodes */}
      </Tree.BranchContent>
    </Tree.Branch>`

export default {
  example,
  id: "TreeBranch",
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
