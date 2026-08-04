import {Component} from "@angular/core"
import {FileText, FolderIcon} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {TreeModule} from "@qualcomm-ui/angular/tree"
import {createTreeCollection} from "@qualcomm-ui/core/tree"

interface Node {
  id: string
  name: string
  nodes?: Node[]
}

@Component({
  imports: [TreeModule, IconDirective],
  providers: [provideIcons({FileText, FolderIcon})],
  selector: "tree-explorer-demo",
  template: `
    <div
      class="w-full max-w-xs"
      q-tree-root
      [collection]="collection"
      [defaultExpandedValue]="['src']"
      [defaultSelectedValue]="['src/app.tsx']"
    >
      @for (
        node of collection.rootNode.nodes;
        let i = $index;
        track collection.getNodeValue(node)
      ) {
        <q-tree-nodes showIndentGuide [indexPath]="[i]" [node]="node">
          <ng-template
            let-branch
            q-tree-branch-template
            [rootNode]="collection.rootNode"
          >
            <div q-tree-branch-node>
              <div q-tree-node-indicator></div>
              <div q-tree-branch-trigger></div>
              <span q-tree-node-checkbox></span>
              <svg q-tree-node-icon qIcon="FolderIcon"></svg>
              <span q-tree-node-text>{{ branch.node.name }}</span>
            </div>
          </ng-template>

          <ng-template
            let-leaf
            q-tree-leaf-template
            [rootNode]="collection.rootNode"
          >
            <div q-tree-leaf-node>
              <div q-tree-node-indicator></div>
              <span q-tree-node-checkbox></span>
              <svg q-tree-node-icon qIcon="FileText"></svg>
              <span q-tree-node-text>{{ leaf.node.name }}</span>
            </div>
          </ng-template>
        </q-tree-nodes>
      }
    </div>
  `,
})
export class TreeExplorerDemo {
  collection = createTreeCollection<Node>({
    nodeChildren: "nodes",
    nodeText: (node) => node.name,
    nodeValue: (node) => node.id,
    rootNode: {
      id: "ROOT",
      name: "",
      nodes: [
        {
          id: "src",
          name: "src",
          nodes: [
            {id: "src/app.tsx", name: "app.tsx"},
            {id: "src/index.ts", name: "index.ts"},
          ],
        },
        {id: "package.json", name: "package.json"},
        {id: "tsconfig.json", name: "tsconfig.json"},
      ],
    },
  })
}
