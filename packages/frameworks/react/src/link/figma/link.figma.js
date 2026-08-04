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
const label = instance.getString("label") || "Action"
const size = instance.getEnum("size", {
  lg: "lg",
  md: "md",
  xl: "xl",
  xs: "xs",
  xxl: "xxl",
})
const startIcon = instance.getBoolean("startIcon")
const endIcon = instance.getBoolean("endIcon")

const figmaSize = instance.getString("size")
const swapSize =
  figmaSize === "xs" || figmaSize === "sm"
    ? "Xs"
    : figmaSize === "xxl"
      ? "Md"
      : "Sm"

const startIconInstance = startIcon
  ? instance.getInstanceSwap(`startIcon${swapSize}`)
  : undefined
const endIconInstance = endIcon
  ? instance.getInstanceSwap(`endIcon${swapSize}`)
  : undefined

const startIconName = startIconInstance
  ? toLucideName(startIconInstance.name)
  : "File"
const endIconName = endIconInstance
  ? toLucideName(endIconInstance.name)
  : "ChevronRight"

const disabledAttr = disabled ? " disabled" : ""
const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const startIconAttr = startIcon ? ` startIcon={${startIconName}}` : ""
const endIconAttr = endIcon ? ` endIcon={${endIconName}}` : ""

const icons = [
  ...new Set(
    [startIcon && startIconName, endIcon && endIconName].filter(Boolean),
  ),
]

const example = figma.code`<Link${disabledAttr}${emphasisAttr}${sizeAttr}${startIconAttr}${endIconAttr} href="#">${label}</Link>`

export default {
  example,
  id: "Link",
  imports: [
    `import {Link} from "@qualcomm-ui/react/link"`,
    ...(icons.length > 0
      ? [`import {${icons.join(", ")}} from "lucide-react"`]
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
