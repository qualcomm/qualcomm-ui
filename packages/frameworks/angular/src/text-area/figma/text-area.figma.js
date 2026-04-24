// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=4587-9674
// component=TextArea

const figma = require("figma")

const instance = figma.selectedInstance

const filled = instance.getBoolean("filled")
const defaultValue = filled ? instance.getString("inputText") : undefined
const placeholder = !filled ? instance.getString("holderText") : undefined
const label = instance.getBoolean("label", {
  true: instance.getString("labelText"),
})
const hint = instance.getBoolean("hint", {
  true: instance.getString("hintText"),
})
const count = instance.getBoolean("count")
const countText = count ? instance.getString("countText") : undefined
const maxLength = countText?.match(/\/(\d+)/)?.[1]

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
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
})

const counterAttr = count && !maxLength ? " counter" : ""
const defaultValueAttr = defaultValue ? ` defaultValue="${defaultValue}"` : ""
const disabledAttr = disabled ? " disabled" : ""
const errorTextAttr = errorText ? ` errorText="${errorText}"` : ""
const hintAttr = hint ? ` hint="${hint}"` : ""
const invalidAttr = invalid ? " invalid" : ""
const labelAttr = label ? ` label="${label}"` : ""
const maxLengthAttr = maxLength ? ` [maxLength]="${maxLength}"` : ""
const placeholderAttr = placeholder
  ? ` placeholder="${placeholder}"`
  : ` placeholder="Enter text"`
const readOnlyAttr = readOnly ? " readOnly" : ""
const requiredAttr = required ? " required" : ""
const sizeAttr = size ? ` size="${size}"` : ""

export default {
  example: figma.code`
    <q-text-area${counterAttr}${defaultValueAttr}${disabledAttr}${errorTextAttr}${hintAttr}${invalidAttr}${labelAttr}${maxLengthAttr}${placeholderAttr}${readOnlyAttr}${requiredAttr}${sizeAttr}>
    </q-text-area>`,
  id: "TextArea",
  imports: [`import {TextAreaModule} from "@qualcomm-ui/angular/text-area"`],
  metadata: {nestable: true},
}
