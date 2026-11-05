import {Component, computed, inject, input, type OnInit} from "@angular/core"
import {LucideFileText, LucideFolder} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {
  provideTreeNodePropsContext,
  provideTreeNodeStateContext,
  TreeNodePropsContextService,
  TreeNodeStateContextService,
  useTreeContext,
} from "@qualcomm-ui/angular-core/tree"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {TreeModule} from "@qualcomm-ui/angular/tree"
import {createTreeCollection, type NodeProps} from "@qualcomm-ui/core/tree"

interface FileNode {
  id: string
  name: string
  nodes?: FileNode[]
}

const collection = createTreeCollection<FileNode>({
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
      {id: "tsconfig.json", name: "tsconfig.json"},
    ],
  },
})

@Component({
  imports: [TreeModule, IconDirective],
  providers: [
    provideIcons({LucideFileText, LucideFolder}),
    provideTreeNodePropsContext(),
    provideTreeNodeStateContext(),
  ],
  selector: "tree-nodes-recursive",
  template: `
    @let childNodes = treeContext().collection.getNodeChildren(node());
    @if (childNodes.length) {
      <div q-tree-branch>
        <div q-tree-branch-node>
          <div q-tree-node-indicator></div>
          <div q-tree-branch-trigger></div>
          <svg q-tree-node-icon qIcon="LucideFolder"></svg>
          <span q-tree-node-text>
            {{ treeContext().collection.stringifyNode(node()) }}
          </span>
        </div>
        <div q-tree-branch-content>
          <div q-tree-branch-indent-guide></div>
          @for (
            childNode of childNodes;
            let j = $index;
            track treeContext().collection.getNodeValue(childNode)
          ) {
            <tree-nodes-recursive
              [indexPath]="indexPath().concat(j)"
              [node]="childNode"
            />
          }
        </div>
      </div>
    } @else {
      <div q-tree-leaf-node>
        <div q-tree-node-indicator></div>
        <svg q-tree-node-icon qIcon="LucideFileText"></svg>
        <span q-tree-node-text>
          {{ treeContext().collection.stringifyNode(node()) }}
        </span>
      </div>
    }
  `,
})
export class TreeNodesRecursive implements OnInit {
  readonly indexPath = input.required<number[]>()
  readonly node = input.required<FileNode>()

  protected readonly treeContext = useTreeContext()

  private readonly nodePropsService = inject(TreeNodePropsContextService)
  private readonly nodeStateService = inject(TreeNodeStateContextService)

  ngOnInit() {
    const nodeProps = computed<NodeProps<FileNode>>(() => ({
      indexPath: this.indexPath(),
      node: this.node(),
    }))
    this.nodePropsService.init(nodeProps)
    this.nodeStateService.init(
      computed(() => this.treeContext().getNodeState(nodeProps())),
    )
  }
}

@Component({
  imports: [TreeModule, TreeNodesRecursive],
  providers: [provideIcons({LucideFileText, LucideFolder})],
  selector: "tree-nodes-demo",
  template: `
    <div class="w-full max-w-sm" q-tree-root [collection]="collection">
      @for (
        node of collection.rootNode.nodes;
        let i = $index;
        track collection.getNodeValue(node)
      ) {
        <tree-nodes-recursive [indexPath]="[i]" [node]="node" />
      }
    </div>
  `,
})
export class TreeNodesDemo {
  collection = collection
}
