// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=6622-615
// component=ProgressRing

const figma = require("figma")

const instance = figma.selectedInstance

const emphasis = instance.getEnum("emphasis", {
  neutral: "neutral",
})
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
  xl: "xl",
  xs: "xs",
  xxs: "xxs",
})
const indeterminate = instance.getBoolean("indeterminate")
const disabled = instance.getEnum("state", {
  disabled: true,
})
const invalid = instance.getEnum("state", {
  invalid: true,
})
const hint = instance.getBoolean("hint")
const hintText = hint ? instance.getString("hintText") : undefined
const errorText = invalid && hint ? instance.getString("errorText") : undefined
const percentage = !indeterminate ? instance.getBoolean("percentage") : false
const percentOpts = percentage
  ? instance.findInstance("Percentage", {traverseInstances: true})
  : undefined
const number = percentOpts?.getString("number") || "25"

const disabledAttr = disabled ? " disabled" : ""
const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const errorTextAttr = errorText ? ` errorText="${errorText}"` : ""
const invalidAttr = invalid ? " invalid" : ""
const labelAttr = hintText ? ` label="${hintText}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const valueAttr = !indeterminate ? ` value="${number}"` : ""
const valueTextAttr = percentage ? ` valueText="${number}%"` : ""

export default {
  example: figma.code`
    <div${disabledAttr}${emphasisAttr}${errorTextAttr}${invalidAttr}${labelAttr}
      q-progress-ring${sizeAttr}${valueAttr}${valueTextAttr}>
    </div>`,
  id: "ProgressRing",
  imports: [
    `import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"`,
  ],
  metadata: {nestable: true},
}
