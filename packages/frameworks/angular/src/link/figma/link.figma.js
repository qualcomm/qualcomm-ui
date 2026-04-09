// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=55-4432
// component=Link

const figma = require("figma")

const instance = figma.selectedInstance

const disabled = instance.getEnum("state", {disabled: true})
const emphasis = instance.getEnum("emphasis", {
  brand: "brand",
  neutral: "neutral",
  "white-persistent": "white-persistent",
})
const size = instance.getEnum("size", {
  lg: "lg",
  md: "md",
  xl: "xl",
  xs: "xs",
  xxl: "xxl",
})
const startIcon = instance.getBoolean("startIcon")
const endIcon = instance.getBoolean("endIcon")

const disabledAttr = disabled ? " disabled" : ""
const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const startIconAttr = startIcon ? ` startIcon="File"` : ""
const endIconAttr = endIcon ? ` endIcon="ChevronRight"` : ""

const example = figma.code`<a${disabledAttr}${emphasisAttr}${endIconAttr} href="#" q-link${sizeAttr}${startIconAttr}>Action</a>`

export default {
  example,
  id: "Link",
  imports: [
    `import {LinkDirective} from "@qualcomm-ui/angular/link"`,
    ...(startIcon || endIcon
      ? [
          `import {${[startIcon && "File", endIcon && "ChevronRight"].filter(Boolean).join(", ")}} from "lucide-angular"`,
        ]
      : []),
  ],
  metadata: {nestable: true},
}
