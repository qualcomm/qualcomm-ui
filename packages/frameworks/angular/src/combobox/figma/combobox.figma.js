// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=13121-11284
// component=Combobox

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
const startIcon = instance.getBoolean("startIcon")
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
})

const disabledAttr = disabled ? " disabled" : ""
const errorTextAttr = invalid ? ` errorText="Error message"` : ""
const hintAttr = hint ? ` hint="${hint}"` : ""
const iconAttr = startIcon ? ` icon="Layers"` : ""
const invalidAttr = invalid ? " invalid" : ""
const labelAttr = label ? ` label="${label}"` : ` aria-label="Select an option"`
const readOnlyAttr = readOnly ? " readOnly" : ""
const requiredAttr = required ? " required" : ""
const sizeAttr = size ? ` size="${size}"` : ""

export default {
  example: figma.code`
    <q-combobox
      [collection]="collection"${disabledAttr}${errorTextAttr}${hintAttr}${iconAttr}${invalidAttr}${labelAttr}
      placeholder="Select an option"${readOnlyAttr}${requiredAttr}${sizeAttr}>
    </q-combobox>`,
  id: "Combobox",
  imports: [
    `import {ComboboxModule} from "@qualcomm-ui/angular/combobox"`,
    ...(startIcon ? [`import {Layers} from "lucide-angular"`] : []),
  ],
  metadata: {nestable: true},
}
