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
const disabledAttr = disabled ? " disabled" : ""

let example

if (icon === "only") {
  example = figma.code`
    <label${disabledAttr} aria-label="Section" icon="AArrowDown" q-segmented-control-item value="section"></label>`
}

if (icon === "start") {
  example = figma.code`
    <label${disabledAttr} icon="AArrowDown" q-segmented-control-item text="${text}" value="${text}"></label>`
}

if (icon === "none") {
  example = figma.code`
    <label${disabledAttr} q-segmented-control-item text="${text}" value="${text}"></label>`
}

export default {
  example,
  id: "SegmentedControlItem",
  imports: [
    `import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"`,
  ],
  metadata: {nestable: true},
}
