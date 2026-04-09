// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=3728-17610
// component=Breadcrumb

const figma = require("figma")

const instance = figma.selectedInstance

const emphasis = instance.getEnum("emphasis", {neutral: "neutral"})
const size = instance.getEnum("size", {lg: "lg", sm: "sm"})

const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""

const items = instance.findConnectedInstances((node) => {
  const s = node.getEnum("state", {
    active: "a",
    disabled: "d",
    focus: "f",
    hover: "h",
    idle: "i",
    pressed: "p",
  })
  return typeof s === "string"
})

const children = items.reduce(
  (acc, item) => figma.code`${acc}${item.executeTemplate()?.example}`,
  figma.code``,
)

export default {
  example: figma.code`
    <nav aria-label="Breadcrumbs"${emphasisAttr} q-breadcrumbs-root${sizeAttr}>
      <ol q-breadcrumbs-list>
        ${children}
      </ol>
    </nav>`,
  id: "Breadcrumbs",
  imports: [
    `import {BreadcrumbsModule} from "@qualcomm-ui/angular/breadcrumbs"`,
  ],
  metadata: {nestable: true},
}
