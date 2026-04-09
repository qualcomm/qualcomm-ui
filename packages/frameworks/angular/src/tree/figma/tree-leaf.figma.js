// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=8859-910
// component=Tree Leaf Node

const figma = require("figma")

const instance = figma.selectedInstance

const variant = instance.getString("variant")
const nodeText = instance.getString("leafText") || "Leaf name"

const indicatorEl = `<div q-tree-node-indicator></div>`
const iconEl =
  variant === "icon" ? `<svg q-tree-node-icon qIcon="FileText"></svg>` : ""
const checkboxEl =
  variant === "checkbox" ? `<span q-tree-node-checkbox></span>` : ""

const iconImports =
  variant === "icon"
    ? [
        `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
        `import {FileText} from "lucide-angular"`,
      ]
    : []

export default {
  example: figma.code`
    <div q-tree-leaf-node>
      ${indicatorEl}${iconEl}${checkboxEl}
      <span q-tree-node-text>${nodeText}</span>
    </div>`,
  id: "TreeLeafNode",
  imports: [
    `import {TreeModule} from "@qualcomm-ui/angular/tree"`,
    ...iconImports,
  ],
  metadata: {nestable: true},
}
