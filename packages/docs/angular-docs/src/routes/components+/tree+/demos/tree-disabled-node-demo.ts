import {Component} from "@angular/core"
import {LucideFileText, LucideFolder} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {TreeModule} from "@qualcomm-ui/angular/tree"
import {createTreeCollection} from "@qualcomm-ui/core/tree"

interface FileNode {
  disabled?: boolean
  id: string
  name: string
  nodes?: FileNode[]
}

@Component({
  imports: [TreeModule, IconDirective],
  providers: [provideIcons({LucideFileText, LucideFolder})],
  selector: "tree-disabled-node-demo",
  template: `
    <div class="w-full max-w-sm" q-tree-root [collection]="collection">
      @for (
        node of collection.rootNode.nodes;
        let i = $index;
        track collection.getNodeValue(node)
      ) {
        <q-tree-nodes [indexPath]="[i]" [node]="node">
          <ng-template
            let-branch
            q-tree-branch-template
            [rootNode]="collection.rootNode"
          >
            <div q-tree-branch-node>
              <div q-tree-node-indicator></div>
              <div q-tree-branch-trigger></div>
              <svg q-tree-node-icon qIcon="LucideFolder"></svg>
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
              <svg q-tree-node-icon qIcon="LucideFileText"></svg>
              <span q-tree-node-text>{{ leaf.node.name }}</span>
            </div>
          </ng-template>
        </q-tree-nodes>
      }
    </div>
  `,
})
export class TreeDisabledNodeDemo {
  collection = createTreeCollection<FileNode>({
    nodeChildren: "nodes",
    nodeText: (node) => node.name,
    nodeValue: (node) => node.id,
    rootNode: {
      id: "ROOT",
      name: "",
      nodes: [
        {
          id: "node_modules",
          name: "node_modules",
          nodes: [
            {
              id: "@qui",
              name: "@qui",
              nodes: [
                {
                  id: "node_modules/@qualcomm-ui/core",
                  name: "@qualcomm-ui/core",
                },
                {
                  id: "node_modules/@qualcomm-ui/react",
                  name: "@qualcomm-ui/react",
                },
                {
                  id: "node_modules/@qualcomm-ui/react-core",
                  name: "@qualcomm-ui/react-core",
                },
              ],
            },
            {
              id: "node_modules/@types",
              name: "@types",
              nodes: [
                {id: "node_modules/@types/react", name: "react"},
                {id: "node_modules/@types/react-dom", name: "react-dom"},
              ],
            },
          ],
        },
        {
          id: "src",
          name: "src",
          nodes: [
            {id: "src/app.tsx", name: "app.tsx"},
            {id: "src/index.ts", name: "index.ts"},
          ],
        },
        {id: "prettier.config.js", name: "prettier.config.js"},
        {id: "package.json", name: "package.json"},
        {disabled: true, id: "renovate.json", name: "renovate.json"},
        {id: "tsconfig.json", name: "tsconfig.json"},
      ],
    },
  })
}
