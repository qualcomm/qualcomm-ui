// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=7394-1748
// component=ContainedTabGroup

const figma = require("figma")

const instance = figma.selectedInstance

const iconVariant = instance.getEnum("iconVariant", {filled: "filled"})
const orientation = instance.getEnum("orientation", {vertical: "vertical"})
const size = instance.getEnum("size", {sm: "sm"})
const plusBtn = instance.getBoolean("plusBtn")

const iconVariantAttr = iconVariant ? ` iconVariant="${iconVariant}"` : ""
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

const addButtonEl = plusBtn
  ? `\n<Button aria-label="Add tab" onClick={addTab} size="sm" startIcon={Plus} variant="ghost" />`
  : ""

const panels = items
  .map((_, i) => `<Tabs.Panel value="tab-id">Content ${i + 1}</Tabs.Panel>`)
  .join("\n")

export default {
  example: figma.code`
    <Tabs.Root defaultValue="tab1"${iconVariantAttr}${orientationAttr}${sizeAttr} variant="contained">
      <Tabs.List>
        ${children}${addButtonEl}
      </Tabs.List>
      ${panels}
    </Tabs.Root>`,
  id: "ContainedTabGroup",
  imports: [
    `import {Tab, Tabs} from "@qualcomm-ui/react/tabs"`,
    ...(plusBtn
      ? [
          `import {Button} from "@qualcomm-ui/react/button"`,
          `import {Plus} from "lucide-react"`,
        ]
      : []),
  ],
  metadata: {nestable: true},
}
