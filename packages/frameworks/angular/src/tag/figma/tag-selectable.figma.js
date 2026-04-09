// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=16835-3076
// component=Tag selectable

const figma = require("figma")

const instance = figma.selectedInstance

const disabled = instance.getEnum("state", {disabled: true})
const emphasis = instance.getString("emphasis")
const label = instance.getString("label") || "Label"
const radius = instance.getEnum("radius", {rounded: "rounded"})
const size = instance.getEnum("size", {large: "lg", small: "sm"})
const startIcon = instance.getBoolean("startIcon")
const endIcon = instance.getBoolean("endIcon")

const disabledAttr = disabled ? " disabled" : ""
const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const radiusAttr = radius ? ` radius="${radius}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const startIconAttr = startIcon ? ` startIcon="Smile"` : ""
const endIconAttr = endIcon ? ` endIcon="Smile"` : ""

const needsIcon = startIcon || endIcon

let example

if (needsIcon) {
  example = figma.code`
    <button${disabledAttr}${emphasisAttr} q-tag${radiusAttr}${sizeAttr}${startIconAttr}${endIconAttr} variant="selectable">
      ${label}
    </button>`
} else {
  example = figma.code`<button${disabledAttr}${emphasisAttr} q-tag${radiusAttr}${sizeAttr} variant="selectable">${label}</button>`
}

export default {
  example,
  id: "TagSelectable",
  imports: [
    `import {TagDirective} from "@qualcomm-ui/angular/tag"`,
    ...(needsIcon
      ? [
          `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
          `import {Smile} from "lucide-angular"`,
        ]
      : []),
  ],
  metadata: {nestable: true},
}
