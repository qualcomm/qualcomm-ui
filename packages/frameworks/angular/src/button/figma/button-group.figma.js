// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=7191-1090
// component=Button group

const figma = require("figma")

const instance = figma.selectedInstance

const layout = instance.getEnum("buttonWidth", {fill: "fill"})
const size = instance.getEnum("size", {lg: "lg", sm: "sm"})

const layoutAttr = layout ? ` layout="${layout}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""

const buttons = instance.findConnectedInstances(
  (node) => !!node.getString("label"),
)

const children = buttons.reduce(
  (acc, btn) => figma.code`${acc}${btn.executeTemplate()?.example}`,
  figma.code``,
)

export default {
  example: figma.code`
    <div${layoutAttr} q-button-group${sizeAttr}>
      ${children}
    </div>`,
  id: "ButtonGroup",
  imports: [`import {ButtonModule} from "@qualcomm-ui/angular/button"`],
  metadata: {nestable: true},
}
