// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=17809-2448
// component=Avatar

const figma = require("figma")

const instance = figma.selectedInstance

const layers = {
  icon: "Avatar icon options",
  image: "Avatar image options",
  initial: "Avatar initial options",
}
const variant = instance.getEnum("variant", {
  icon: "icon",
  image: "image",
  initial: "initial",
})

const child = instance.findInstance(layers[variant] || layers.icon)

export default {
  example: figma.code`${child?.executeTemplate()?.example}`,
  id: "Avatar",
  imports: [`import {AvatarModule} from "@qualcomm-ui/angular/avatar"`],
  metadata: {nestable: true},
}
