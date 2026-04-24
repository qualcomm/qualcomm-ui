// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=16776-17872
// component=Tag link

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
const endIconAttr = endIcon ? ` endIcon="ChevronRight"` : ""

const icons = [startIcon && "Smile", endIcon && "ChevronRight"].filter(Boolean)
const needsIcon = icons.length > 0

let example

if (needsIcon) {
  example = figma.code`
    <button${disabledAttr}${emphasisAttr} q-tag${radiusAttr}${sizeAttr}${startIconAttr}${endIconAttr} variant="link">
      ${label}
    </button>`
} else {
  example = figma.code`<button${disabledAttr}${emphasisAttr} q-tag${radiusAttr}${sizeAttr} variant="link">${label}</button>`
}

export default {
  example,
  id: "TagLink",
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
