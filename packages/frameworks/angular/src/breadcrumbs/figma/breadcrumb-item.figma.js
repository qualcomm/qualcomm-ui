// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=3728-13488
// component=BreadcrumbItem

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

const disabledAttr = state === "disabled" ? " disabled" : ""
const currentPageAttr = state === "active" ? ` aria-current="page"` : ""
const triggerTag = state === "active" ? "span" : "a"
const hrefAttr = state === "active" ? "" : ` href="/components"`
const iconEl = showIcon
  ? `<svg q-breadcrumb-item-icon qIcon="${iconName}"></svg>`
  : ""

export default {
  example: figma.code`
    <li${disabledAttr}${currentPageAttr} q-breadcrumb-item>
      <${triggerTag}${hrefAttr} q-breadcrumb-item-trigger>
        ${iconEl}
        Breadcrumb
      </${triggerTag}>
    </li>`,
  id: "BreadcrumbItem",
  imports: [
    `import {BreadcrumbsModule} from "@qualcomm-ui/angular/breadcrumbs"`,
    ...(showIcon
      ? [
          `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
          `import {Lucide${iconName}} from "@lucide/angular"`,
        ]
      : []),
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
