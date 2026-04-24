// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=12609-520
// component=Switch

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

const checkedAttr = defaultChecked ? " defaultChecked" : ""
const disabledAttr = disabled ? " disabled" : ""
const invalidAttr = invalid ? " invalid" : ""
const sizeAttr = size ? ` size="${size}"` : ""

export default {
  example: figma.code`<label q-switch${checkedAttr}${disabledAttr}${invalidAttr}${sizeAttr}></label>`,
  id: "Switch",
  imports: ['import {SwitchModule} from "@qualcomm-ui/angular/switch"'],
  metadata: {nestable: true},
}
