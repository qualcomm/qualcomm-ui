import {Component, input, output, signal} from "@angular/core"
import {
  LucideFileText,
  LucideFolder,
  LucidePlus,
  LucideTrash,
} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {useTreeContext} from "@qualcomm-ui/angular-core/tree"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {TreeModule} from "@qualcomm-ui/angular/tree"
import {createTreeCollection} from "@qualcomm-ui/core/tree"
import type {TreeCollection} from "@qualcomm-ui/utils/collection"

interface FileNode {
  id: string
  name: string
  nodes?: FileNode[]
}

@Component({
  imports: [TreeModule],
  providers: [provideIcons({LucidePlus, LucideTrash})],
  selector: "tree-node-actions",
  template: `
    <button
      aria-label="Remove node"
      icon="Trash"
      q-tree-node-action
      size="sm"
      (click)="onRemove()"
    ></button>
    @if (isBranch()) {
      <button
        aria-label="Add node"
        icon="Plus"
        q-tree-node-action
        size="sm"
        (click)="onAdd()"
      ></button>
    }
  `,
})
export class TreeNodeActions {
  readonly node = input.required<FileNode>()
  readonly indexPath = input.required<number[]>()
  readonly isBranch = input(false)

  readonly add = output<{indexPath: number[]; node: FileNode}>()
  readonly remove = output<{indexPath: number[]; node: FileNode}>()

  protected readonly treeContext = useTreeContext()

  onRemove() {
    this.remove.emit({indexPath: this.indexPath(), node: this.node()})
  }

  onAdd() {
    this.treeContext().expand([this.node().id])
    this.add.emit({indexPath: this.indexPath(), node: this.node()})
  }
}

const initialCollection = createTreeCollection<FileNode>({
  nodeChildren: "nodes",
  nodeText: "name",
  nodeValue: "id",
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
      {id: "tsconfig.json", name: "tsconfig.json"},
    ],
  },
})

@Component({
  imports: [TreeModule, IconDirective, TreeNodeActions],
  providers: [
    provideIcons({LucideFileText, LucideFolder, LucidePlus, LucideTrash}),
  ],
  selector: "tree-add-remove-demo",
  template: `
    <div class="w-full max-w-sm" q-tree-root [collection]="collection()">
      @for (
        node of collection().rootNode.nodes;
        let i = $index;
        track collection().getNodeValue(node)
      ) {
        <q-tree-nodes [indexPath]="[i]" [node]="node">
          <ng-template
            let-branch
            q-tree-branch-template
            [rootNode]="collection().rootNode"
          >
            <div q-tree-branch-node role="treeitem">
              <div q-tree-node-indicator></div>
              <div q-tree-branch-trigger></div>
              <svg q-tree-node-icon qIcon="LucideFolder"></svg>
              <span q-tree-node-text>
                {{ collection().stringifyNode(branch.node) }}
              </span>
              <tree-node-actions
                [indexPath]="branch.indexPath"
                [isBranch]="true"
                [node]="branch.node"
                (add)="addNode($event)"
                (remove)="removeNode($event)"
              />
            </div>
          </ng-template>

          <ng-template
            let-leaf
            q-tree-leaf-template
            [rootNode]="collection().rootNode"
          >
            <div q-tree-leaf-node>
              <div q-tree-node-indicator></div>
              <svg q-tree-node-icon qIcon="LucideFileText"></svg>
              <span q-tree-node-text>
                {{ collection().stringifyNode(leaf.node) }}
              </span>
              <tree-node-actions
                [indexPath]="leaf.indexPath"
                [isBranch]="false"
                [node]="leaf.node"
                (remove)="removeNode($event)"
              />
            </div>
          </ng-template>
        </q-tree-nodes>
      }
    </div>
  `,
})
export class TreeAddRemoveDemo {
  readonly collection = signal<TreeCollection<FileNode>>(initialCollection)

  removeNode(event: {indexPath: number[]; node: FileNode}) {
    this.collection.update((c) => c.remove([event.indexPath]))
  }

  addNode(event: {indexPath: number[]; node: FileNode}) {
    const {indexPath, node} = event
    if (!this.collection().isBranchNode(node)) {
      return
    }

    const nodes = [
      {
        id: `untitled-${Date.now()}`,
        name: `untitled-${node.nodes?.length || 0}.tsx`,
      },
      ...(node.nodes || []),
    ]
    this.collection.update((c) => c.replace(indexPath, {...node, nodes}))
  }
}
