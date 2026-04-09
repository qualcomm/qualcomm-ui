// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=17812-2960
// component=Badge

const figma = require("figma")

const instance = figma.selectedInstance

const variant = instance.getEnum("variant", {
  count: "count",
  icon: "icon",
  status: "status",
  text: "text",
})

const layers = {
  count: "Badge count options",
  icon: "Badge icon options",
  status: "Badge status options",
  text: "Badge text options",
}
const child = instance.findInstance(layers[variant] || layers.count)

export default {
  example: figma.code`${child?.executeTemplate()?.example}`,
  id: "Badge",
  imports: [`import {BadgeModule} from "@qualcomm-ui/angular/badge"`],
  metadata: {nestable: true},
}
