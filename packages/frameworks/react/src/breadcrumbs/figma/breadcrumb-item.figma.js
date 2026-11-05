// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=3728-13488
// component=BreadcrumbsItem

const figma = require("figma")

const instance = figma.selectedInstance

const state = instance.getEnum("state", {
  active: "active",
  disabled: "disabled",
})
const showIcon = instance.getBoolean("showIcon")

const figmaSize = instance.getString("size")
const swapPropName =
  figmaSize === "sm" ? "iconXxs" : figmaSize === "md" ? "iconXs" : "iconSm"

const iconInstance = showIcon
  ? instance.getInstanceSwap(swapPropName)
  : undefined
const iconName = iconInstance ? toLucideName(iconInstance.name) : "FolderClosed"

const currentAttr = state === "active" ? ` aria-current="page"` : ""
const disabledAttr = state === "disabled" ? " disabled" : ""
const iconAttr = showIcon ? ` icon={${iconName}}` : ""
const renderAttr =
  state === "active" ? "" : ` render={<a href="/components" />}`

const example = figma.code`<Breadcrumbs.Item${currentAttr}${disabledAttr}${iconAttr}${renderAttr}>Breadcrumb</Breadcrumbs.Item>`

export default {
  example,
  id: "BreadcrumbsItem",
  imports: [
    `import {Breadcrumbs} from "@qualcomm-ui/react/breadcrumbs"`,
    ...(showIcon ? [`import {${iconName}} from "lucide-react"`] : []),
  ],
  metadata: {nestable: true},
}

function toLucideName(figmaName) {
  return figmaName
    .replace(/^utl\//, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}
