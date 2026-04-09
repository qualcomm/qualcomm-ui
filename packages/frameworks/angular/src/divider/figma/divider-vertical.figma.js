// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=13492-10
// component=Divider Vertical

const figma = require("figma")

const instance = figma.selectedInstance

const variant = instance.getEnum("variant", {
  strong: "strong",
  subtle: "subtle",
})

const variantAttr = variant ? ` variant="${variant}"` : ""

export default {
  example: figma.code`<hr orientation="vertical" q-divider${variantAttr} />`,
  id: "DividerVertical",
  imports: [`import {DividerDirective} from "@qualcomm-ui/angular/divider"`],
  metadata: {nestable: true},
}
