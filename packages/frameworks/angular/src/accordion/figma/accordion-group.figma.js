// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=2191-5476
// component=Accordion group

const figma = require("figma")

const instance = figma.selectedInstance

const contained = instance.getBoolean("contained")
const size = instance.getEnum("size", {lg: "lg", sm: "sm"})

const sizeAttr = size ? ` size="${size}"` : ""
const uncontainedAttr = !contained ? " uncontained" : ""

const items = instance.findConnectedInstances(
  (node) => typeof node.getBoolean("subHeader") === "boolean",
  {traverseInstances: true},
)

const children = items.reduce(
  (acc, item) => figma.code`${acc}${item.executeTemplate()?.example}`,
  figma.code``,
)

export default {
  example: figma.code`
    <div q-accordion${sizeAttr}${uncontainedAttr} [defaultValue]="['a']">
      ${children}
    </div>`,
  id: "AccordionGroup",
  imports: [`import {AccordionModule} from "@qualcomm-ui/angular/accordion"`],
  metadata: {nestable: true},
}
