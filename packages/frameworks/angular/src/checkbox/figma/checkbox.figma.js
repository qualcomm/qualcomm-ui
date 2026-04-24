// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=12550-185694
// component=Checkbox

const figma = require("figma")

const instance = figma.selectedInstance

const defaultChecked = instance.getEnum("variant", {
  checked: true,
  "invalid-checked": true,
})
const disabled = instance.getEnum("state", {
  disabled: true,
})
const indeterminate = instance.getEnum("variant", {
  indeterminate: true,
  "invalid-indeterminate": true,
})
const invalid = instance.getEnum("variant", {
  "invalid-checked": true,
  "invalid-indeterminate": true,
  "invalid-unchecked": true,
})
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
})

const checkedAttr = defaultChecked ? " defaultChecked" : ""
const disabledAttr = disabled ? " disabled" : ""
const indeterminateAttr = indeterminate ? " indeterminate" : ""
const invalidAttr = invalid ? " invalid" : ""
const sizeAttr = size ? ` size="${size}"` : ""

export default {
  example: figma.code`<label q-checkbox${checkedAttr}${disabledAttr}${indeterminateAttr}${invalidAttr}${sizeAttr}></label>`,
  id: "Checkbox",
  imports: ['import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"'],
  metadata: {nestable: true},
}
