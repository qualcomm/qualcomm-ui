// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=7363-3965
// component=ContainedTab

const figma = require("figma")

const instance = figma.selectedInstance

const disabled = instance.getEnum("state", {disabled: true})
const dismissible = instance.getBoolean("dismissible")
const icon = instance.getEnum("icon", {
  only: "only",
  start: "start",
})
const label = instance.getString("label")

const needsIcon = icon === "start" || icon === "only"
const iconName = "AArrowDown"

const disabledAttr = disabled ? " disabled" : ""
const startIconAttr = needsIcon ? ` startIcon="${iconName}"` : ""
const ariaLabelAttr = icon === "only" ? ` aria-label="${label}"` : ""
const labelText = icon === "only" ? "" : label
const dismissButtonEl = dismissible
  ? `<button q-tab-dismiss-button aria-label="Dismiss tab"></button>`
  : ""

const example = figma.code`
    <div${disabledAttr} q-tab-root value="tab-id">
      <button${ariaLabelAttr}${startIconAttr} q-tab-button>${labelText}</button>
      ${dismissButtonEl}
    </div>`

export default {
  example,
  id: "ContainedTab",
  imports: [
    `import {TabsModule} from "@qualcomm-ui/angular/tabs"`,
    ...(needsIcon
      ? [
          `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
          `import {Lucide${iconName}} from "@lucide/angular"`,
        ]
      : []),
  ],
  metadata: {nestable: true},
}
