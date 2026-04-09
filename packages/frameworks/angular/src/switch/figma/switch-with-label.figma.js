// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=2270-5170
// component=Switch with label

const figma = require("figma")

const instance = figma.selectedInstance

const defaultChecked = instance.getEnum("variant", {
  checked: true,
  "invalid-checked": true,
})
const disabled = instance.getEnum("state", {
  disabled: true,
})
const invalid = instance.getEnum("variant", {
  "invalid-checked": true,
  "invalid-unchecked": true,
})
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
})
const label = instance.getBoolean("label", {
  true: instance.getString("labelText"),
})
const hint = instance.getBoolean("hint", {
  true: instance.getString("hintText"),
})
const errorText = instance.getString("errorText")

const checkedAttr = defaultChecked ? " defaultChecked" : ""
const disabledAttr = disabled ? " disabled" : ""
const invalidAttr = invalid ? " invalid" : ""
const sizeAttr = size ? ` size="${size}"` : ""
const labelAttr = label ? ` label="${label}"` : ""
const hintAttr = hint ? ` hint="${hint}"` : ""
const errorAttr = invalid && errorText ? ` errorText="${errorText}"` : ""

export default {
  example: figma.code`<label q-switch${checkedAttr}${disabledAttr}${errorAttr}${hintAttr}${invalidAttr}${labelAttr}${sizeAttr}></label>`,
  id: "SwitchWithLabel",
  imports: ['import {SwitchModule} from "@qualcomm-ui/angular/switch"'],
  metadata: {nestable: true},
}
