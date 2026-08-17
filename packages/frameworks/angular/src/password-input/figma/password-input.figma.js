// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=5307-3964
// component=PasswordInput

const figma = require("figma")

const instance = figma.selectedInstance

const defaultValue = instance.getBoolean("filled", {
  true: instance.getString("passwordText"),
})
const defaultVisible = instance.getEnum("password", {
  show: true,
})
const label = instance.getBoolean("label", {
  true: instance.getString("labelText"),
})
const hint = instance.getBoolean("hint", {
  true: instance.getString("hintText"),
})
const placeholder = instance.getBoolean("filled", {
  false: instance.getString("holderText"),
})
const state = instance.getString("state")
const disabled = state === "disabled"
const invalid = state === "invalid" || state === "invalid-focus"
const readOnly = state === "read-only"
const required = instance.getBoolean("required")
const startIcon = instance.getBoolean("startIcon")
const size = instance.getString("size")
const swapPropName = size === "lg" ? "iconSm" : "iconXs"

const iconInstance = startIcon
  ? instance.getInstanceSwap(swapPropName)
  : undefined
const iconName = iconInstance ? toLucideName(iconInstance.name) : "KeyRound"

const defaultValueAttr = defaultValue ? ` defaultValue="${defaultValue}"` : ""
const defaultVisibleAttr = defaultVisible ? " defaultVisible" : ""
const disabledAttr = disabled ? " disabled" : ""
const errorTextAttr = invalid ? ` errorText="Error message"` : ""
const hintAttr = hint ? ` hint="${hint}"` : ""
const invalidAttr = invalid ? " invalid" : ""
const labelAttr = label ? ` label="${label}"` : ""
const placeholderAttr = placeholder
  ? ` placeholder="${placeholder}"`
  : ` placeholder="Enter password"`
const readOnlyAttr = readOnly ? " readOnly" : ""
const requiredAttr = required ? " required" : ""
const sizeAttr = size === "md" ? "" : ` size="${size}"`
const startIconAttr = startIcon ? ` startIcon="${iconName}"` : ""

export default {
  example: figma.code`
    <q-password-input${defaultValueAttr}${defaultVisibleAttr}${disabledAttr}${errorTextAttr}${hintAttr}${invalidAttr}${labelAttr}${placeholderAttr}${readOnlyAttr}${requiredAttr}${sizeAttr}${startIconAttr}>
    </q-password-input>`,
  id: "PasswordInput",
  imports: [
    `import {PasswordInputModule} from "@qualcomm-ui/angular/password-input"`,
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
