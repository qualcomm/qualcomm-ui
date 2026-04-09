// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=17804-5308
// component=Avatar

const figma = require("figma")

const instance = figma.selectedInstance

const emphasis = instance.getEnum("emphasis", {
  brand: "brand",
  "high-contrast": "contrast",
})
const size = instance.getEnum("size", {lg: "lg", sm: "sm", xl: "xl", xs: "xs"})
const status = instance.getBoolean("status")

const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const statusAttr = status ? ` status="active"` : ""
const statusEl = status ? `<div q-avatar-status></div>` : ""

export default {
  example: figma.code`
    <div q-avatar${emphasisAttr}${sizeAttr}${statusAttr}>
      <div q-avatar-content>
        <svg aria-label="User" qIcon="User"></svg>
      </div>
      ${statusEl}
    </div>`,
  id: "AvatarIcon",
  imports: [
    `import {AvatarModule} from "@qualcomm-ui/angular/avatar"`,
    `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
    `import {User} from "lucide-angular"`,
  ],
  metadata: {nestable: true},
}
