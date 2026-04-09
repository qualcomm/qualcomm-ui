// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=2295-1239
// component=Checkbox group

const figma = require("figma")

const instance = figma.selectedInstance

const indented = instance.getBoolean("indented")
const invalid = instance.getBoolean("destructive")
const label = instance.getBoolean("label", {
  true: instance.getString("labelText"),
})
const orientation = instance.getEnum("orientation", {
  horizontal: "horizontal",
})
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
})

const errorTextAttr = invalid ? ` errorText="Error message"` : ""
const indentedAttr = indented ? " indented" : ""
const invalidAttr = invalid ? " invalid" : ""
const labelAttr = label ? ` label="${label}"` : ""
const orientationAttr = orientation ? ` orientation="${orientation}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""

const checkboxes = instance.findConnectedInstances(
  (node) => typeof node.getString("labelText") === "string",
)

const children = checkboxes.reduce(
  (acc, cb) => figma.code`${acc}${cb.executeTemplate()?.example}`,
  figma.code``,
)

export default {
  example: figma.code`
    <fieldset${errorTextAttr}${indentedAttr}${invalidAttr}${labelAttr}${orientationAttr}
      q-checkbox-group${sizeAttr}
    >
      ${children}
    </fieldset>`,
  id: "CheckboxGroup",
  imports: [
    'import {CheckboxGroupModule} from "@qualcomm-ui/angular/checkbox-group"',
    'import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"',
  ],
  metadata: {nestable: true},
}
