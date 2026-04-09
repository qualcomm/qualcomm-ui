// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=2270-3948
// component=Radio with label

const figma = require("figma")

const instance = figma.selectedInstance

const defaultChecked = instance.getEnum("variant", {
  checked: true,
  "invalid-checked": true,
})
const disabled = instance.getEnum("state", {
  disabled: true,
})
const hint = instance.getBoolean("hint", {
  true: instance.getString("hintText"),
})
const label = instance.getBoolean("label", {
  true: instance.getString("labelText"),
})
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
})

const checkedAttr = defaultChecked ? " defaultChecked" : ""
const disabledAttr = disabled ? " disabled" : ""
const hintAttr = hint ? ` hint="${hint}"` : ""
const labelAttr = label ? ` label="${label}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""

export default {
  example: figma.code`<label q-radio${checkedAttr}${disabledAttr}${hintAttr}${labelAttr}${sizeAttr} value="option"></label>`,
  id: "RadioWithLabel",
  imports: ['import {RadioModule} from "@qualcomm-ui/angular/radio"'],
  metadata: {nestable: true},
}
