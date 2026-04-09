// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=12607-174277
// component=Radio

const figma = require("figma")

const instance = figma.selectedInstance

const defaultChecked = instance.getEnum("variant", {
  checked: true,
  "invalid-checked": true,
})
const disabled = instance.getEnum("state", {
  disabled: true,
})
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
})

const checkedAttr = defaultChecked ? " defaultChecked" : ""
const disabledAttr = disabled ? " disabled" : ""
const sizeAttr = size ? ` size="${size}"` : ""

export default {
  example: figma.code`<label q-radio${checkedAttr}${disabledAttr}${sizeAttr} value="option"></label>`,
  id: "Radio",
  imports: ['import {RadioModule} from "@qualcomm-ui/angular/radio"'],
  metadata: {nestable: true},
}
