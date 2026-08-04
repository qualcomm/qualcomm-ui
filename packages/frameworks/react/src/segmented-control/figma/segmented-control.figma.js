// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=7169-793
// component=SegmentedControl

const figma = require("figma")

const instance = figma.selectedInstance

const layout = instance.getEnum("width", {fill: "fill"})
const orientation = instance.getEnum("orientation", {vertical: "vertical"})
const size = instance.getEnum("size", {lg: "lg", sm: "sm"})
const variant = instance.getEnum("emphasis", {primary: "primary"})

const layoutAttr = layout ? ` layout="${layout}"` : ""
const orientationAttr = orientation ? ` orientation="${orientation}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const variantAttr = variant ? ` variant="${variant}"` : ""

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
    <SegmentedControl.Root defaultValue={["section-1"]}${layoutAttr}${orientationAttr}${sizeAttr}${variantAttr}>
      ${children}
    </SegmentedControl.Root>`,
  id: "SegmentedControl",
  imports: [
    `import {SegmentedControl} from "@qualcomm-ui/react/segmented-control"`,
  ],
  metadata: {nestable: true},
}
