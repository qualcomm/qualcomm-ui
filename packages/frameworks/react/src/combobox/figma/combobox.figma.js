// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=13121-11284
// component=Combobox

const figma = require("figma")

const instance = figma.selectedInstance

const labelOn = instance.getBoolean("label")
const labelText = labelOn ? instance.getString("labelText") : undefined
const hintOn = instance.getBoolean("hint")
const hintText = hintOn ? instance.getString("hintText") : undefined
const disabled = instance.getEnum("state", {disabled: true})
const invalid = instance.getEnum("state", {
  invalid: true,
  "invalid-focus": true,
  "invalid-open": true,
})
const readOnly = instance.getEnum("state", {"read-only": true})
const required = instance.getBoolean("required")
const startIcon = instance.getBoolean("startIcon")
const size = instance.getEnum("size", {lg: "lg", sm: "sm"})

const iconInstance = startIcon ? instance.getInstanceSwap("iconXs") : undefined
const iconName = iconInstance ? toLucideName(iconInstance.name) : "Layers"

const disabledAttr = disabled ? " disabled" : ""
const errorTextAttr = invalid ? ` errorText="Error message"` : ""
const hintAttr = hintText ? ` hint="${hintText}"` : ""
const iconAttr = startIcon ? ` icon={${iconName}}` : ""
const invalidAttr = invalid ? " invalid" : ""
const labelAttr = labelText ? ` label="${labelText}"` : ""
const readOnlyAttr = readOnly ? " readOnly" : ""
const requiredAttr = required ? " required" : ""
const sizeAttr = size ? ` size="${size}"` : ""

const inputPropsAttr = labelText
  ? ""
  : ` inputProps={{"aria-label": "Select an option"}}`

const example = figma.code`<Combobox collection={comboboxCollection({items: ["Option 1", "Option 2", "Option 3"]})}${disabledAttr}${errorTextAttr}${hintAttr}${iconAttr}${inputPropsAttr}${invalidAttr}${labelAttr}${readOnlyAttr}${requiredAttr}${sizeAttr} />`

export default {
  example,
  id: "Combobox",
  imports: [
    `import {comboboxCollection} from "@qualcomm-ui/core/combobox"`,
    `import {Combobox} from "@qualcomm-ui/react/combobox"`,
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
