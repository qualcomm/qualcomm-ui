// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=4771-2328
// component=NumberInput

const figma = require("figma")

const instance = figma.selectedInstance

const defaultValue = instance.getBoolean("filled", {
  true: instance.getString("inputText"),
})
const label = instance.getBoolean("label", {
  true: instance.getString("labelText"),
})
const hint = instance.getBoolean("hint", {
  true: instance.getString("hintText"),
})
const disabled = instance.getEnum("state", {
  disabled: true,
})
const invalid = instance.getEnum("state", {
  invalid: true,
  "invalid-focus": true,
})
const errorText = invalid ? instance.getString("errorText") : undefined
const readOnly = instance.getEnum("state", {
  "read-only": true,
})
const required = instance.getBoolean("required")
const unitSelector = instance.getBoolean("unitSelector")
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
})

const unitSelect = instance.findInstance("_Unit select")
const defaultUnit = unitSelect?.getString("unitText")

const defaultUnitAttr = unitSelector ? ` defaultUnit="${defaultUnit}"` : ""
const defaultValueAttr = defaultValue ? ` defaultValue="${defaultValue}"` : ""
const disabledAttr = disabled ? " disabled" : ""
const errorTextAttr = errorText ? ` errorText="${errorText}"` : ""
const hintAttr = hint ? ` hint="${hint}"` : ""
const invalidAttr = invalid ? " invalid" : ""
const labelAttr = label ? ` label="${label}"` : ` aria-label="Enter a number"`
const readOnlyAttr = readOnly ? " readOnly" : ""
const requiredAttr = required ? " required" : ""
const sizeAttr = size ? ` size="${size}"` : ""
const unitOptionsAttr = unitSelector ? ` [unitOptions]="unitOptions"` : ""

export default {
  example: figma.code`
    <q-number-input${defaultUnitAttr}${defaultValueAttr}${disabledAttr}${errorTextAttr}${hintAttr}${invalidAttr}${labelAttr}
      placeholder="0"${readOnlyAttr}${requiredAttr}${sizeAttr}${unitOptionsAttr}>
    </q-number-input>`,
  id: "NumberInput",
  imports: [
    `import {NumberInputModule} from "@qualcomm-ui/angular/number-input"`,
  ],
  metadata: {nestable: true},
}
