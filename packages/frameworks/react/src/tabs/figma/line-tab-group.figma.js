// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=8863-9067
// component=LineTabGroup

const figma = require("figma")

const instance = figma.selectedInstance

const orientation = instance.getEnum("orientation", {vertical: "vertical"})
const size = instance.getEnum("size", {lg: "lg", sm: "sm", xl: "xl"})

const orientationAttr = orientation ? ` orientation="${orientation}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""

const items = instance.findConnectedInstances((node) => {
  const s = node.getEnum("state", {
    disabled: "d",
    focused: "f",
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

const panels = items
  .map((_, i) => `<Tabs.Panel value="tab-id">Content ${i + 1}</Tabs.Panel>`)
  .join("\n")

export default {
  example: figma.code`
    <Tabs.Root defaultValue="tab1"${orientationAttr}${sizeAttr}>
      <Tabs.List>
        <Tabs.Indicator />
        ${children}
      </Tabs.List>
      ${panels}
    </Tabs.Root>`,
  id: "LineTabGroup",
  imports: [`import {Tab, Tabs} from "@qualcomm-ui/react/tabs"`],
  metadata: {nestable: true},
}
