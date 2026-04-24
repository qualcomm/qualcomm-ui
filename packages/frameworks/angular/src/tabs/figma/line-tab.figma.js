// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=7755-27338
// component=Line tab

const figma = require("figma")

const instance = figma.selectedInstance

const disabled = instance.getEnum("state", {disabled: true})
const icon = instance.getEnum("icon", {
  only: "only",
  start: "start",
})
const label = instance.getString("label")

const disabledAttr = disabled ? " disabled" : ""
const iconAttr = icon === "start" ? ` startIcon="AArrowDown"` : ""
const iconOnlyAttr = icon === "only" ? ` startIcon="AArrowDown"` : ""

let tabButton
if (icon === "only") {
  tabButton = `<button${iconOnlyAttr} q-tab-button aria-label="${label}"></button>`
} else {
  tabButton = `<button${iconAttr} q-tab-button>${label}</button>`
}

export default {
  example: figma.code`
    <div${disabledAttr} q-tab-root value="tab-id">
      ${tabButton}
    </div>`,
  id: "LineTab",
  imports: [
    `import {TabsModule} from "@qualcomm-ui/angular/tabs"`,
    ...(icon
      ? [
          `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
          `import {AArrowDown} from "lucide-angular"`,
        ]
      : []),
  ],
  metadata: {nestable: true},
}
