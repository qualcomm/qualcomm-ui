// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=16548-1775
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
  only: "only",
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

const densityAttr = ` density="compact"`
const disabledAttr = disabled ? " disabled" : ""
const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const variantAttr = variant ? ` variant="${variant}"` : ""

const needsIcon = icon === "start" || icon === "end" || icon === "only"

let example

// icon-only compact button
if (icon === "only") {
  example = figma.code`<button${densityAttr}${disabledAttr}${emphasisAttr} icon="Star" q-icon-button${sizeAttr}${variantAttr}></button>`
}

// compact button with start icon
if (icon === "start") {
  example = figma.code`
    <button${densityAttr}${disabledAttr}${emphasisAttr} q-button${sizeAttr}${variantAttr}>
      <svg q-start-icon qIcon="Star"></svg>
      ${label}
    </button>`
}

// compact button with end icon
if (icon === "end") {
  example = figma.code`
    <button${densityAttr}${disabledAttr}${emphasisAttr} q-button${sizeAttr}${variantAttr}>
      ${label}
      <svg q-end-icon qIcon="Star"></svg>
    </button>`
}

// compact button without icon
if (icon === "none") {
  example = figma.code`<button${densityAttr}${disabledAttr}${emphasisAttr} q-button${sizeAttr}${variantAttr}>${label}</button>`
}

export default {
  example,
  id: "CompactButton",
  imports: [
    `import {ButtonModule} from "@qualcomm-ui/angular/button"`,
    ...(needsIcon
      ? [
          `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
          `import {Star} from "lucide-angular"`,
        ]
      : []),
  ],
  metadata: {nestable: true},
}
