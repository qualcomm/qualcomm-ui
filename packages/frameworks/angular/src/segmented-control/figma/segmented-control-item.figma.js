// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=7169-3039
// component=_Segmented control foundation

const figma = require("figma")

const instance = figma.selectedInstance

const disabled = instance.getEnum("state", {disabled: "disabled"})
const icon = instance.getEnum("icon", {
  none: "none",
  only: "only",
  start: "start",
})
const text = instance.findText("Action").textContent

const figmaSize = instance.getString("size")
const swapPropName =
  figmaSize === "sm" ? "iconXxs" : figmaSize === "md" ? "iconXs" : "iconSm"

const needsIcon = icon === "start" || icon === "only"
const iconInstance = needsIcon
  ? instance.getInstanceSwap(swapPropName)
  : undefined
const iconName = iconInstance ? toLucideName(iconInstance.name) : "AArrowDown"

const disabledAttr = disabled ? " disabled" : ""
const ariaLabelAttr = icon === "only" ? ` aria-label="Section"` : ""
const iconAttr = needsIcon ? ` icon="${iconName}"` : ""
const textAttr = icon === "only" ? "" : ` text="${text}"`
const valueAttr = icon === "only" ? ` value="section"` : ` value="${text}"`

const example = figma.code`<label${disabledAttr}${ariaLabelAttr}${iconAttr} q-segmented-control-item${textAttr}${valueAttr}></label>`

export default {
  example,
  id: "SegmentedControlItem",
  imports: [
    `import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"`,
    ...(needsIcon
      ? [
          `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
          `import {Lucide${iconName}} from "@lucide/angular"`,
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
