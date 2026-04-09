// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=5578-13
// component=Divider Horizontal

const figma = require("figma")

const instance = figma.selectedInstance

const variant = instance.getEnum("variant", {
  strong: "strong",
  subtle: "subtle",
})

const variantAttr = variant ? ` variant="${variant}"` : ""

export default {
  example: figma.code`<hr q-divider${variantAttr} />`,
  id: "DividerHorizontal",
  imports: [`import {DividerDirective} from "@qualcomm-ui/angular/divider"`],
  metadata: {nestable: true},
}
