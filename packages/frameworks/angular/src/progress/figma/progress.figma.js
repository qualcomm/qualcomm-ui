// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=4402-120
// component=Progress

const figma = require("figma")

const instance = figma.selectedInstance

const indeterminate = instance.getEnum("indeterminate", {
  True: true,
})
const label = instance.getBoolean("label", {
  true: instance.getString("labelText"),
})
const disabled = instance.getEnum("state", {
  disabled: true,
})
const invalid = instance.getEnum("state", {
  invalid: true,
})
const errorText = invalid ? instance.getString("errorText") : undefined
const hint = instance.getBoolean("hint", {
  true: instance.getString("hintText"),
})
const percentage = !indeterminate ? instance.getBoolean("percentage") : false
const percentOpts = percentage
  ? instance.findInstance("Text percentage options", {traverseInstances: true})
  : undefined
const number = percentOpts?.getString("number") || "25"
const emphasis = instance.getEnum("emphasis", {
  neutral: "neutral",
})
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
})
const labelOrientation = instance.getEnum("labelPosition", {
  side: "side",
})

const disabledAttr = disabled ? " disabled" : ""
const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const errorTextAttr = errorText ? ` errorText="${errorText}"` : ""
const hintAttr = hint ? ` hint="${hint}"` : ""
const invalidAttr = invalid ? " invalid" : ""
const labelAttr = label ? ` label="${label}"` : ""
const labelOrientationAttr = labelOrientation
  ? ` labelOrientation="${labelOrientation}"`
  : ""
const sizeAttr = size ? ` size="${size}"` : ""
const valueAttr = !indeterminate ? ` value="${number}"` : ""
const valueTextAttr = percentage ? ` valueText="${number}%"` : ""

export default {
  example: figma.code`
    <div${disabledAttr}${emphasisAttr}${errorTextAttr}${hintAttr}${invalidAttr}${labelAttr}${labelOrientationAttr}
      q-progress${sizeAttr}${valueAttr}${valueTextAttr}>
    </div>`,
  id: "Progress",
  imports: [`import {ProgressModule} from "@qualcomm-ui/angular/progress"`],
  metadata: {nestable: true},
}
