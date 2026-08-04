// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=16928-3307
// component=Tag dismissible

const figma = require("figma")

const instance = figma.selectedInstance

const disabled = instance.getEnum("state", {disabled: true})
const emphasis = instance.getString("emphasis")
const label = instance.getString("label") || "Label"
const shape = instance.getEnum("radius", {rounded: "rounded"})
const size = instance.getString("size")
const startIcon = instance.getBoolean("icon")

const swapPropName = size === "sm" ? "iconXxs" : "iconXs"

const startIconInstance = startIcon
  ? instance.getInstanceSwap(swapPropName)
  : undefined
const startIconName = startIconInstance
  ? toLucideName(startIconInstance.name)
  : "Smile"

const disabledAttr = disabled ? " disabled" : ""
const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const shapeAttr = shape ? ` shape="${shape}"` : ""
const sizeAttr = size === "md" ? "" : ` size="${size}"`
const startIconAttr = startIcon ? ` startIcon={${startIconName}}` : ""

const example = figma.code`<Tag${disabledAttr}${emphasisAttr}${shapeAttr}${sizeAttr}${startIconAttr} variant="dismissable">${label}</Tag>`

export default {
  example,
  id: "TagDismissible",
  imports: [
    `import {Tag} from "@qualcomm-ui/react/tag"`,
    ...(startIcon ? [`import {${startIconName}} from "lucide-react"`] : []),
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
