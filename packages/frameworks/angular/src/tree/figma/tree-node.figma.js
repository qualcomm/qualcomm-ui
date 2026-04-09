// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=8859-749
// component=Tree Branch Node

const figma = require("figma")

const instance = figma.selectedInstance

const variant = instance.getString("variant")
const nodeText = instance.getString("nodeText") || "Branch name"

const iconEl =
  variant === "icon" ? `<svg q-tree-node-icon qIcon="FolderIcon"></svg>` : ""
const checkboxEl =
  variant === "checkbox" ? `<span q-tree-node-checkbox></span>` : ""

const iconImports =
  variant === "icon"
    ? [
        `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
        `import {FolderIcon} from "lucide-angular"`,
      ]
    : []

export default {
  example: figma.code`
    <div q-tree-branch-node>
      <div q-tree-branch-trigger></div>
      ${iconEl}${checkboxEl}
      <span q-tree-node-text>${nodeText}</span>
    </div>`,
  id: "TreeBranchNode",
  imports: [
    `import {TreeModule} from "@qualcomm-ui/angular/tree"`,
    ...iconImports,
  ],
  metadata: {nestable: true},
}
