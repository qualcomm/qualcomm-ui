// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=9077-12455
// component=Tree

const figma = require("figma")

const instance = figma.selectedInstance

const variant = instance.getString("variant")
const size = instance.getEnum("size", {sm: "sm"})

const sizeAttr = size ? ` size="${size}"` : ""

const branchIcon =
  variant === "icon" ? `<svg q-tree-node-icon qIcon="FolderIcon"></svg>` : ""
const branchCheckbox =
  variant === "checkbox" ? `<span q-tree-node-checkbox></span>` : ""

const leafIndicator = `<div q-tree-node-indicator></div>`
const leafIcon =
  variant === "icon" ? `<svg q-tree-node-icon qIcon="LucideFileText"></svg>` : ""
const leafCheckbox =
  variant === "checkbox" ? `<span q-tree-node-checkbox></span>` : ""

const expandedAttr =
  variant === "icon" ? ` [defaultExpandedValue]="['node-1']"` : ""

const iconImports =
  variant === "icon"
    ? [
        `import {IconDirective} from "@qualcomm-ui/angular/icon"`,
        `import {LucideFileText, FolderIcon} from "@lucide/angular"`,
      ]
    : []

export default {
  example: figma.code`
    <!-- Create and pass a TreeCollection instance from your component class. -->
    <div q-tree-root${sizeAttr} [collection]="collection"${expandedAttr}>
      @for (node of collection.rootNode.nodes; let i = $index; track collection.getNodeValue(node)) {
        <q-tree-nodes [indexPath]="[i]" [node]="node">
          <ng-template let-branch q-tree-branch-template [rootNode]="collection.rootNode">
            <div q-tree-branch-node>
              <div q-tree-branch-trigger></div>
              ${branchIcon}${branchCheckbox}
              <span q-tree-node-text>{{ branch.node.name }}</span>
            </div>
          </ng-template>
          <ng-template let-leaf q-tree-leaf-template [rootNode]="collection.rootNode">
            <div q-tree-leaf-node>
              ${leafIndicator}${leafIcon}${leafCheckbox}
              <span q-tree-node-text>{{ leaf.node.name }}</span>
            </div>
          </ng-template>
        </q-tree-nodes>
      }
    </div>`,
  id: "Tree",
  imports: [
    `import {TreeModule} from "@qualcomm-ui/angular/tree"`,
    `import {createTreeCollection} from "@qualcomm-ui/core/tree"`,
    ...iconImports,
  ],
  metadata: {nestable: true},
}
