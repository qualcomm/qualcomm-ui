// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=4227-2418
// component=TextInput

const figma = require("figma")

const instance = figma.selectedInstance

const filled = instance.getBoolean("filled")
const defaultValue = filled ? instance.getString("inputText") : undefined
const placeholder = !filled ? instance.getString("holderText") : undefined
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
const errorText = invalid ? instance.getString("errorText") : undefined
const required = instance.getBoolean("required")
const startIcon = instance.getBoolean("startIcon")
const endIcon = instance.getBoolean("endIcon")
const size = instance.getString("size")
const startSwap = size === "lg" ? "iconLsm" : "iconLxs"
const endSwap = size === "lg" ? "iconRsm" : "iconRxs"

const startIconInstance = startIcon
  ? instance.getInstanceSwap(startSwap)
  : undefined
const endIconInstance = endIcon ? instance.getInstanceSwap(endSwap) : undefined

const startIconName = startIconInstance
  ? toLucideName(startIconInstance.name)
  : "Search"
const endIconName = endIconInstance
  ? toLucideName(endIconInstance.name)
  : "Calendar"

const defaultValueAttr = defaultValue ? ` defaultValue="${defaultValue}"` : ""
const disabledAttr = disabled ? " disabled" : ""
const endIconAttr = endIcon ? ` endIcon={${endIconName}}` : ""
const errorTextAttr = errorText ? ` errorText="${errorText}"` : ""
const hintAttr = hint ? ` hint="${hint}"` : ""
const invalidAttr = invalid ? " invalid" : ""
const labelAttr = label ? ` label="${label}"` : ""
const placeholderAttr = placeholder
  ? ` placeholder="${placeholder}"`
  : ` placeholder="Enter text"`
const readOnlyAttr = readOnly ? " readOnly" : ""
const requiredAttr = required ? " required" : ""
const sizeAttr = size === "md" ? "" : ` size="${size}"`
const startIconAttr = startIcon ? ` startIcon={${startIconName}}` : ""

const icons = [
  ...new Set(
    [startIcon && startIconName, endIcon && endIconName].filter(Boolean),
  ),
]

const example = figma.code`<TextInput${defaultValueAttr}${disabledAttr}${endIconAttr}${errorTextAttr}${hintAttr}${invalidAttr}${labelAttr}${placeholderAttr}${readOnlyAttr}${requiredAttr}${sizeAttr}${startIconAttr} />`

export default {
  example,
  id: "TextInput",
  imports: [
    `import {TextInput} from "@qualcomm-ui/react/text-input"`,
    ...(icons.length > 0
      ? [`import {${icons.join(", ")}} from "lucide-react"`]
      : []),
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
