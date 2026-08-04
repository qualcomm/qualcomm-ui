// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=3571-1400
// component=Button

const figma = require("figma")

const instance = figma.selectedInstance

const disabled = instance.getEnum("state", {disabled: true})
const emphasis = instance.getEnum("emphasis", {
  "black-persistent": "black-persistent",
  danger: "danger",
  primary: "primary",
  "white-persistent": "white-persistent",
})
const icon = instance.getEnum("icon", {
  end: "end",
  none: "none",
  start: "start",
})
const label = instance.getString("label") || "Button"
const size = instance.getEnum("size", {
  large: "lg",
  small: "sm",
})
const variant = instance.getEnum("variant", {
  ghost: "ghost",
  outline: "outline",
})

const figmaSize = instance.getString("size")
const swapPropName =
  figmaSize === "small"
    ? "iconXxs"
    : figmaSize === "medium"
      ? "iconXs"
      : "iconSm"

const iconInstance =
  icon === "start" || icon === "end"
    ? instance.getInstanceSwap(swapPropName)
    : undefined

const iconName = iconInstance ? toLucideName(iconInstance.name) : "Star"
const needsIcon = icon === "start" || icon === "end"

const disabledAttr = disabled ? " disabled" : ""
const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const variantAttr = variant ? ` variant="${variant}"` : ""
const iconAttr =
  icon === "start"
    ? ` startIcon={${iconName}}`
    : icon === "end"
      ? ` endIcon={${iconName}}`
      : ""

const example = figma.code`<Button${iconAttr}${variantAttr}${emphasisAttr}${sizeAttr}${disabledAttr}>${label}</Button>`

export default {
  example,
  id: "Button",
  imports: [
    `import {Button} from "@qualcomm-ui/react/button"`,
    ...(needsIcon ? [`import {${iconName}} from "lucide-react"`] : []),
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
