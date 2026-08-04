// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=7169-3039
// component=SegmentedControlItem

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
const iconAttr = needsIcon ? ` icon={${iconName}}` : ""
const textAttr = icon === "only" ? "" : ` text="${text}"`
const valueAttr = icon === "only" ? ` value="section"` : ` value="${text}"`

const example = figma.code`<SegmentedControl.Item${disabledAttr}${iconAttr}${textAttr}${valueAttr} />`

export default {
  example,
  id: "SegmentedControlItem",
  imports: [
    `import {SegmentedControl} from "@qualcomm-ui/react/segmented-control"`,
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
