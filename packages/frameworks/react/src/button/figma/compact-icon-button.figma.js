// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=22861-1682
// component=IconButton

const figma = require("figma")

const instance = figma.selectedInstance

const disabled = instance.getEnum("state", {disabled: true})
const emphasis = instance.getEnum("emphasis", {
  "black-persistent": "black-persistent",
  danger: "danger",
  primary: "primary",
  "white-persistent": "white-persistent",
})
const shape = instance.getEnum("shape", {
  rounded: "rounded",
})
const size = instance.getEnum("size", {
  large: "lg",
  small: "sm",
})
const variant = instance.getEnum("variant", {
  ghost: "ghost",
  outline: "outline",
})

const figmaSize = instance.getString("size")
const swapPropName = figmaSize === "small" ? "iconXxs" : "iconXs"

const iconInstance = instance.getInstanceSwap(swapPropName)
const iconName = iconInstance ? toLucideName(iconInstance.name) : "Star"

const disabledAttr = disabled ? " disabled" : ""
const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const shapeAttr = shape ? ` shape="${shape}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const variantAttr = variant ? ` variant="${variant}"` : ""

const example = figma.code`<IconButton density="compact" icon={${iconName}}${variantAttr}${emphasisAttr}${shapeAttr}${sizeAttr}${disabledAttr} />`

export default {
  example,
  id: "IconButton",
  imports: [
    `import {IconButton} from "@qualcomm-ui/react/button"`,
    `import {${iconName}} from "lucide-react"`,
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
