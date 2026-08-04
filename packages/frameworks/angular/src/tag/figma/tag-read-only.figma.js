// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=16762-2131
// component=Tag read only

const figma = require("figma")

const instance = figma.selectedInstance

const disabled = instance.getEnum("state", {disabled: true})
const emphasis = instance.getString("emphasis")
const label = instance.getString("label") || "Label"
const shape = instance.getEnum("shape", {rounded: "rounded"})
const size = instance.getString("size")
const startIcon = instance.getBoolean("startIcon")
const endIcon = instance.getBoolean("endIcon")

const startSwap = size === "sm" ? "iconXxsStart" : "iconXsStart"
const endSwap = size === "sm" ? "iconXxsEnd" : "iconXsEnd"

const startIconInstance = startIcon
  ? instance.getInstanceSwap(startSwap)
  : undefined
const endIconInstance = endIcon ? instance.getInstanceSwap(endSwap) : undefined

const startIconName = startIconInstance
  ? toLucideName(startIconInstance.name)
  : "Smile"
const endIconName = endIconInstance
  ? toLucideName(endIconInstance.name)
  : "Smile"

const disabledAttr = disabled ? " disabled" : ""
const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const shapeAttr = shape ? ` shape="${shape}"` : ""
const sizeAttr = size === "md" ? "" : ` size="${size}"`
const startIconAttr = startIcon ? ` startIcon="${startIconName}"` : ""
const endIconAttr = endIcon ? ` endIcon="${endIconName}"` : ""

const icons = [
  ...new Set(
    [startIcon && startIconName, endIcon && endIconName].filter(Boolean),
  ),
]
const needsIcon = icons.length > 0

const example = figma.code`<span${disabledAttr}${emphasisAttr} q-tag${shapeAttr}${sizeAttr}${startIconAttr}${endIconAttr}>${label}</span>`

export default {
  example,
  id: "TagReadOnly",
  imports: [
    `import {TagDirective} from "@qualcomm-ui/angular/tag"`,
    ...(needsIcon
      ? [
          `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
          `import {${icons.join(", ")}} from "lucide-angular"`,
        ]
      : []),
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
