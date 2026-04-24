// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=5951-1058
// component=Popover

const figma = require("figma")

const instance = figma.selectedInstance

const emphasis = instance.getEnum("emphasis", {brand: "brand"})

const pointer = instance.findInstance("_Popover pointer placement")
const placement = pointer?.getEnum("position", {
  "bottom-left": "bottom-start",
  "bottom-right": "bottom-end",
  "left-bottom": "left-end",
  "left-middle": "left",
  "left-top": "left-start",
  "right-bottom": "right-end",
  "right-middle": "right",
  "right-top": "right-start",
  "top-left": "top-start",
  "top-middle": "top",
  "top-right": "top-end",
})

const content = instance.findInstance("_Popover content", {
  traverseInstances: true,
})
const heading = content?.getBoolean("heading")
const headingText = content?.getString("headingText") || "Title"
const body = content?.getString("body") || "Description"
const actionItems = content?.getBoolean("actionItems")
const slot = content?.getBoolean("slot")

const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const labelAttr = heading ? ` label="${headingText}"` : ""
const positioningAttr = placement
  ? ` [positioning]="{placement: '${placement}'}"`
  : ""

const slotEl = slot ? `<!-- Custom content -->` : ""
const actionEl = actionItems
  ? `
      <div q-button-group size="sm">
        <button emphasis="neutral" q-button variant="outline">Button</button>
        <button emphasis="primary" q-button>Button</button>
      </div>`
  : ""

export default {
  example: figma.code`
    <div description="${body}"${emphasisAttr}${labelAttr}${positioningAttr} q-popover>
      <div q-popover-anchor>
        <button q-button q-popover-trigger>Show Popover</button>
      </div>
      ${slotEl}
      ${actionEl}
    </div>`,
  id: "Popover",
  imports: [
    `import {PopoverModule} from "@qualcomm-ui/angular/popover"`,
    `import {ButtonModule} from "@qualcomm-ui/angular/button"`,
    ...(actionItems
      ? [`import {ButtonGroupModule} from "@qualcomm-ui/angular/button-group"`]
      : []),
  ],
  metadata: {nestable: true},
}
