// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=16928-3307
// component=Tag dismissible

const figma = require("figma")

const instance = figma.selectedInstance

const disabled = instance.getEnum("state", {disabled: true})
const emphasis = instance.getString("emphasis")
const label = instance.getString("label") || "Label"
const radius = instance.getEnum("radius", {rounded: "rounded"})
const size = instance.getEnum("size", {large: "lg", small: "sm"})
const startIcon = instance.getBoolean("icon")

const disabledAttr = disabled ? " disabled" : ""
const emphasisAttr = emphasis ? ` emphasis="${emphasis}"` : ""
const radiusAttr = radius ? ` radius="${radius}"` : ""
const sizeAttr = size ? ` size="${size}"` : ""
const startIconAttr = startIcon ? ` startIcon="Smile"` : ""

const example = figma.code`
  <span${disabledAttr}${emphasisAttr} q-tag${radiusAttr}${sizeAttr}${startIconAttr} variant="dismissable"
    (dismiss)="onDismiss()">
    ${label}
  </span>`

export default {
  example,
  id: "TagDismissible",
  imports: [
    `import {TagDirective} from "@qualcomm-ui/angular/tag"`,
    ...(startIcon
      ? [
          `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
          `import {Smile} from "lucide-angular"`,
        ]
      : []),
  ],
  metadata: {nestable: true},
}
