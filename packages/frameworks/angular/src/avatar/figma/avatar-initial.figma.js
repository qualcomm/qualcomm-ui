// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=17804-5517
// component=Avatar

const figma = require("figma")

const instance = figma.selectedInstance

const emphasis = instance.getEnum("emphasis", {
  brand: "brand",
  "high-contrast": "contrast",
})
const initialText = instance.getString("initialText")
const size = instance.getEnum("size", {lg: "lg", sm: "sm", xl: "xl", xs: "xs"})
const status = instance.getBoolean("status")

const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const statusAttr = status ? ` status="active"` : ""
const statusEl = status ? `<div q-avatar-status></div>` : ""

export default {
  example: figma.code`
    <div q-avatar${emphasisAttr}${sizeAttr}${statusAttr}>
      <div q-avatar-content>${initialText}</div>
      ${statusEl}
    </div>`,
  id: "AvatarInitial",
  imports: [`import {AvatarModule} from "@qualcomm-ui/angular/avatar"`],
  metadata: {nestable: true},
}
