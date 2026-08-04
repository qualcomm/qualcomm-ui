// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=7394-1748
// component=Contained tab group

const figma = require("figma")

const instance = figma.selectedInstance

const iconVariant = instance.getEnum("iconVariant", {
  filled: "filled",
})
const orientation = instance.getEnum("orientation", {
  vertical: "vertical",
})
const size = instance.getEnum("size", {
  sm: "sm",
})

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
  ? `\n<button aria-label="Add tab" q-button size="sm" startIcon="Plus" variant="ghost" (click)="addTab()"></button>`
  : ""

const panels = items
  .map((_, i) => `<div q-tabs-panel value="tab-id">Panel ${i + 1}</div>`)
  .join("\n")

export default {
  example: figma.code`
    <div defaultValue="tab-id"${iconVariantAttr}${orientationAttr} q-tabs-root${sizeAttr} variant="contained">
      <div q-tabs-list>
        ${children}${addButtonEl}
      </div>
      ${panels}
    </div>`,
  id: "ContainedTabGroup",
  imports: [
    `import {TabsModule} from "@qualcomm-ui/angular/tabs"`,
    ...(plusBtn
      ? [
          `import {ButtonModule} from "@qualcomm-ui/angular/button"`,
          `import {Plus} from "lucide-angular"`,
        ]
      : []),
  ],
  metadata: {nestable: true},
}
