// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=4227-2418
// component=TextInput

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
const startIcon = instance.getBoolean("startIcon")
const endIcon = instance.getBoolean("endIcon")
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
})

const defaultValueAttr = defaultValue ? ` defaultValue="${defaultValue}"` : ""
const disabledAttr = disabled ? " disabled" : ""
const endIconAttr = endIcon ? ` endIcon="Calendar"` : ""
const errorTextAttr = errorText ? ` errorText="${errorText}"` : ""
const hintAttr = hint ? ` hint="${hint}"` : ""
const invalidAttr = invalid ? " invalid" : ""
const labelAttr = label ? ` label="${label}"` : ""
const placeholderAttr = placeholder
  ? ` placeholder="${placeholder}"`
  : ` placeholder="Enter text"`
const readOnlyAttr = readOnly ? " readOnly" : ""
const requiredAttr = required ? " required" : ""
const sizeAttr = size ? ` size="${size}"` : ""
const startIconAttr = startIcon ? ` startIcon="Search"` : ""

const icons = [startIcon && "Search", endIcon && "Calendar"].filter(Boolean)

export default {
  example: figma.code`
    <q-text-input${defaultValueAttr}${disabledAttr}${endIconAttr}${errorTextAttr}${hintAttr}${invalidAttr}${labelAttr}${placeholderAttr}${readOnlyAttr}${requiredAttr}${sizeAttr}${startIconAttr}>
    </q-text-input>`,
  id: "TextInput",
  imports: [
    `import {TextInputModule} from "@qualcomm-ui/angular/text-input"`,
    ...(icons.length
      ? [
          `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
          `import {${icons.join(", ")}} from "lucide-angular"`,
        ]
      : []),
  ],
  metadata: {nestable: true},
}
