// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=8863-9067
// component=Line tab group

const figma = require("figma")

const instance = figma.selectedInstance

const orientation = instance.getEnum("orientation", {
  vertical: "vertical",
})
const size = instance.getEnum("size", {
  lg: "lg",
  sm: "sm",
  xl: "xl",
})

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
  .map((_, i) => `<div q-tabs-panel value="tab-id">Panel ${i + 1}</div>`)
  .join("\n")

export default {
  example: figma.code`
    <div defaultValue="tab-id"${orientationAttr} q-tabs-root${sizeAttr}>
      <div q-tabs-list>
        <div q-tabs-indicator></div>
        ${children}
      </div>
      ${panels}
    </div>`,
  id: "LineTabGroup",
  imports: [`import {TabsModule} from "@qualcomm-ui/angular/tabs"`],
  metadata: {nestable: true},
}
