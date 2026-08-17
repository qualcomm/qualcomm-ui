// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=6831-5712
// component=Select

const figma = require("figma")

const instance = figma.selectedInstance

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
  "invalid-open": true,
})
const readOnly = instance.getEnum("state", {
  "read-only": true,
})
const required = instance.getBoolean("required")
const selected = instance.getBoolean("selected")
const startIcon = instance.getBoolean("startIcon")
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
})
const errorText = invalid ? instance.getString("errorText") : undefined
const inputText = selected ? instance.getString("inputText") : undefined

const iconInstance = startIcon ? instance.getInstanceSwap("iconXs") : undefined
const iconName = iconInstance ? toLucideName(iconInstance.name) : "Layers"

const defaultValueAttr = inputText ? ` [defaultValue]="['${inputText}']"` : ""
const disabledAttr = disabled ? " disabled" : ""
const errorTextAttr = errorText ? ` errorText="${errorText}"` : ""
const hintAttr = hint ? ` hint="${hint}"` : ""
const iconAttr = startIcon ? ` icon="${iconName}"` : ""
const invalidAttr = invalid ? " invalid" : ""
const labelAttr = label ? ` label="${label}"` : ` aria-label="Select an option"`
const readOnlyAttr = readOnly ? " readOnly" : ""
const requiredAttr = required ? " required" : ""
const sizeAttr = size ? ` size="${size}"` : ""

export default {
  example: figma.code`
    <q-select
      [collection]="collection"${defaultValueAttr}${disabledAttr}${errorTextAttr}${hintAttr}${iconAttr}${invalidAttr}${labelAttr}
      placeholder="Select an option"${readOnlyAttr}${requiredAttr}${sizeAttr}>
    </q-select>`,
  id: "Select",
  imports: [
    `import {SelectModule} from "@qualcomm-ui/angular/select"`,
    ...(startIcon ? [`import {Lucide${iconName}} from "@lucide/angular"`] : []),
  ],
  metadata: {nestable: true},
}

function toLucideName(figmaName) {
  return figmaName
    .replace(/^utl\//, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}
