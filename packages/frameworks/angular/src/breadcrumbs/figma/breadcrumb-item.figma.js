// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=3728-13488
// component=_Breadcrumb item

const figma = require("figma")

const instance = figma.selectedInstance

const state = instance.getEnum("state", {
  active: "active",
  disabled: "disabled",
})
const showIcon = instance.getBoolean("showIcon")

const disabledAttr = state === "disabled" ? " disabled" : ""
const ariaCurrentAttr = state === "active" ? ` aria-current="page"` : ""
const iconEl = showIcon
  ? `<svg q-breadcrumb-item-icon qIcon="FolderClosed"></svg>`
  : ""

export default {
  example: figma.code`
    <li${disabledAttr} q-breadcrumb-item>
      <a${ariaCurrentAttr} q-breadcrumb-item-trigger>
        ${iconEl}
        Breadcrumb
      </a>
    </li>`,
  id: "BreadcrumbItem",
  imports: [
    `import {BreadcrumbsModule} from "@qualcomm-ui/angular/breadcrumbs"`,
    ...(showIcon
      ? [
          `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
          `import {FolderClosed} from "lucide-angular"`,
        ]
      : []),
  ],
  metadata: {nestable: true},
}
