// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=10951-1155
// component=IconBadge

const figma = require("figma")

const instance = figma.selectedInstance

const variant = instance.getEnum("variant", {subtle: "subtle"})
const emphasis = instance.getEnum("emphasis", {
  blue: "blue",
  brand: "brand",
  cyan: "cyan",
  danger: "danger",
  green: "green",
  info: "info",
  lime: "lime",
  magenta: "magenta",
  orange: "orange",
  purple: "purple",
  red: "red",
  success: "success",
  teal: "teal",
  warning: "warning",
  yellow: "yellow",
})
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
  xl: "xl",
  xs: "xs",
  xxs: "xxs",
})
const disabled = instance.getEnum("disabled", {yes: true})

const swapPropName = {
  lg: "iconLg",
  md: "iconMd",
  sm: "iconSm",
  xl: "iconXl",
  xs: "iconXs",
  xxs: "iconXxs",
}[instance.getString("size")]

const iconInstance = instance.getInstanceSwap(swapPropName)
const iconName = iconInstance ? toLucideName(iconInstance.name) : "AArrowDown"

const variantAttr = variant ? ` variant="${variant}"` : ""
const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const disabledAttr = disabled ? " disabled" : ""

const example = figma.code`<span${disabledAttr}${emphasisAttr} icon="${iconName}" q-icon-badge${sizeAttr}${variantAttr}></span>`

export default {
  example,
  id: "IconBadge",
  imports: [
    `import {IconBadgeDirective} from "@qualcomm-ui/angular/badge"`,
    `import {${iconName}} from "@lucide/angular"`,
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
