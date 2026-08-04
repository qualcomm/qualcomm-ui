// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=22926-18170
// component=Button compact

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

const iconInstance =
  icon === "start" || icon === "end"
    ? instance.getInstanceSwap("iconXxs")
    : undefined

const iconName = iconInstance ? toLucideName(iconInstance.name) : "Star"
const needsIcon = icon === "start" || icon === "end"

const disabledAttr = disabled ? " disabled" : ""
const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const variantAttr = variant ? ` variant="${variant}"` : ""
const startIconEl =
  icon === "start" ? `<svg q-start-icon qIcon="${iconName}"></svg>` : ""
const endIconEl =
  icon === "end" ? `<svg q-end-icon qIcon="${iconName}"></svg>` : ""

const example = figma.code`<button density="compact"${disabledAttr}${emphasisAttr} q-button${sizeAttr}${variantAttr}>${startIconEl}${label}${endIconEl}</button>`

export default {
  example,
  id: "CompactButton",
  imports: [
    `import {ButtonModule} from "@qualcomm-ui/angular/button"`,
    ...(needsIcon
      ? [
          `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
          `import {${iconName}} from "lucide-angular"`,
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
