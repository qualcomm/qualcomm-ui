// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=2342-1717
// component=Switch group

const figma = require("figma")

const instance = figma.selectedInstance

const indented = instance.getBoolean("indented")
const invalid = instance.getBoolean("destructive")
const label = instance.getString("label")
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

const switches = instance.findConnectedInstances(
  (node) => typeof node.getString("labelText") === "string",
)

const children = switches.reduce(
  (acc, sw) => figma.code`${acc}${sw.executeTemplate()?.example}`,
  figma.code``,
)

export default {
  example: figma.code`
    <fieldset${errorTextAttr}${indentedAttr}${invalidAttr}${labelAttr}${orientationAttr}
      q-switch-group${sizeAttr}
    >
      ${children}
    </fieldset>`,
  id: "SwitchGroup",
  imports: [
    'import {SwitchGroupModule} from "@qualcomm-ui/angular/switch-group"',
    'import {SwitchModule} from "@qualcomm-ui/angular/switch"',
  ],
  metadata: {nestable: true},
}
