// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=2270-4637
// component=Radio group

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

const indentedAttr = indented ? " indented" : ""
const orientationAttr = orientation ? ` orientation="${orientation}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""

const labelEl = label ? `<div q-radio-group-label>${label}</div>` : ""
const errorTextEl = invalid
  ? `<div q-radio-group-error-text>Error message</div>`
  : ""

const radios = instance.findConnectedInstances(
  (node) => typeof node.getString("labelText") === "string",
)

const children = radios.reduce(
  (acc, radio) => figma.code`${acc}${radio.executeTemplate()?.example}`,
  figma.code``,
)

export default {
  example: figma.code`
    <fieldset defaultValue="option1"${indentedAttr} name="radio-group"${orientationAttr}
      q-radio-group${sizeAttr}
    >
      ${labelEl}
      <div q-radio-group-items>
        ${children}
      </div>
      ${errorTextEl}
    </fieldset>`,
  id: "RadioGroup",
  imports: ['import {RadioModule} from "@qualcomm-ui/angular/radio"'],
  metadata: {nestable: true},
}
