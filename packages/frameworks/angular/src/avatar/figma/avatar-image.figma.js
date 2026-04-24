// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=17804-5726
// component=Avatar

const figma = require("figma")

const instance = figma.selectedInstance

const size = instance.getEnum("size", {lg: "lg", sm: "sm", xl: "xl", xs: "xs"})
const status = instance.getBoolean("status")

const sizeAttr = size ? ` size="${size}"` : ""
const statusAttr = status ? ` status="active"` : ""
const statusEl = status ? `<div q-avatar-status></div>` : ""

export default {
  example: figma.code`
    <div q-avatar${sizeAttr}${statusAttr}>
      <img alt="User avatar" q-avatar-image src="path/to/image.jpg" />
      <!-- fallback -->
      <div q-avatar-content>O</div>
      ${statusEl}
    </div>`,
  id: "AvatarImage",
  imports: [`import {AvatarModule} from "@qualcomm-ui/angular/avatar"`],
  metadata: {nestable: true},
}
