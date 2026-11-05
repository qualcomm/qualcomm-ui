// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=5307-3964
// component=PasswordInput

const figma = require("figma")

const instance = figma.selectedInstance

const filled = instance.getBoolean("filled")
const defaultValue = filled ? instance.getString("passwordText") : undefined
const placeholder = !filled ? instance.getString("holderText") : undefined
const defaultVisible = instance.getEnum("password", {show: true})
const label = instance.getBoolean("label")
  ? instance.getString("labelText")
  : undefined
const hint = instance.getBoolean("hint")
  ? instance.getString("hintText")
  : undefined
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
const startIconAttr = startIcon ? ` startIcon={${iconName}}` : ""

const example = figma.code`<PasswordInput${defaultValueAttr}${defaultVisibleAttr}${disabledAttr}${errorTextAttr}${hintAttr}${invalidAttr}${labelAttr}${placeholderAttr}${readOnlyAttr}${requiredAttr}${sizeAttr}${startIconAttr} />`

export default {
  example,
  id: "PasswordInput",
  imports: [
    `import {PasswordInput} from "@qualcomm-ui/react/password-input"`,
    ...(startIcon ? [`import {${iconName}} from "lucide-react"`] : []),
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
