// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=7755-27338
// component=LineTab

const figma = require("figma")

const instance = figma.selectedInstance

const disabled = instance.getEnum("state", {disabled: true})
const icon = instance.getEnum("icon", {
  only: "only",
  start: "start",
})
const label = instance.getString("label")

const figmaSize = instance.getString("size")
const swapPropName = figmaSize === "sm" ? "iconXxs" : "iconXs"

const needsIcon = icon === "start" || icon === "only"
const iconInstance = needsIcon
  ? instance.getInstanceSwap(swapPropName)
  : undefined
const iconName = iconInstance ? toLucideName(iconInstance.name) : "AArrowDown"

const disabledAttr = disabled ? " disabled" : ""
const startIconAttr = needsIcon ? ` startIcon="${iconName}"` : ""
const ariaLabelAttr = icon === "only" ? ` aria-label="${label}"` : ""
const labelText = icon === "only" ? "" : label

const example = figma.code`
    <div${disabledAttr} q-tab-root value="tab-id">
      <button${ariaLabelAttr}${startIconAttr} q-tab-button>${labelText}</button>
    </div>`

export default {
  example,
  id: "LineTab",
  imports: [
    `import {TabsModule} from "@qualcomm-ui/angular/tabs"`,
    ...(needsIcon
      ? [
          `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
          `import {${iconName}} from "@lucide/angular"`,
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
