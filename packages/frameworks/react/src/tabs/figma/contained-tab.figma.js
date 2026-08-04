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
const startIconAttr = needsIcon ? ` startIcon={${iconName}}` : ""
const ariaLabelAttr = icon === "only" ? ` aria-label="${label}"` : ""
const labelText = icon === "only" ? "" : label
const dismissButtonEl = dismissible ? `<Tab.DismissButton />` : ""

const example = figma.code`
    <Tab.Root${disabledAttr} value="tab-id">
      <Tab.Button${ariaLabelAttr}${startIconAttr}>${labelText}</Tab.Button>
      ${dismissButtonEl}
    </Tab.Root>`

export default {
  example,
  id: "ContainedTab",
  imports: [
    `import {Tab} from "@qualcomm-ui/react/tabs"`,
    ...(needsIcon ? [`import {${iconName}} from "lucide-react"`] : []),
  ],
  metadata: {nestable: true},
}
