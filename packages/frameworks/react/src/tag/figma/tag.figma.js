// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=17020-4041
// component=Tag

const figma = require("figma")

const instance = figma.selectedInstance

const layers = {
  dismissible: "Tag dismissible options",
  link: "Tag link options",
  "read-only": "Tag read only options",
  selectable: "Tag selectable options",
}

const variant = instance.getEnum("variant", {
  dismissible: "dismissible",
  link: "link",
  selectable: "selectable",
})

const child = instance.findInstance(layers[variant] || layers["read-only"])

export default {
  example: figma.code`${child?.executeTemplate()?.example}`,
  id: "Tag",
  imports: [`import {Tag} from "@qualcomm-ui/react/tag"`],
  metadata: {nestable: true},
}
