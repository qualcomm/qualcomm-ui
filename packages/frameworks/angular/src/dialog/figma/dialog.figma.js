// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=17862-1908
// component=Dialog

const figma = require("figma")

const instance = figma.selectedInstance

const variant = instance.getEnum("variant", {
  default: "default",
  form: "form",
})

const layers = {
  default: "Dialog default options",
  form: "Dialog form options",
}
const child = instance.findInstance(layers[variant] || layers.default)

export default {
  example: figma.code`${child?.executeTemplate()?.example}`,
  id: "Dialog",
  imports: [`import {DialogModule} from "@qualcomm-ui/angular/dialog"`],
  metadata: {nestable: true},
}
