// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=2288-3939
// component=Tooltip

const figma = require("figma")

const instance = figma.selectedInstance

const placement = instance.getEnum("position", {
  "bottom-left": "bottom-start",
  "bottom-right": "bottom-end",
  left: "left",
  right: "right",
  top: "top",
  "top-left": "top-start",
  "top-right": "top-end",
})
const text = instance.getString("text")

const positioningAttr = placement
  ? ` [positioning]="{placement: '${placement}'}"`
  : ""

export default {
  example: figma.code`
    <div${positioningAttr} q-tooltip>
      <button q-button q-tooltip-trigger>
        Hover me
      </button>
      ${text}
    </div>`,
  id: "Tooltip",
  imports: [
    `import {TooltipModule} from "@qualcomm-ui/angular/tooltip"`,
    `import {ButtonModule} from "@qualcomm-ui/angular/button"`,
  ],
  metadata: {nestable: true},
}
