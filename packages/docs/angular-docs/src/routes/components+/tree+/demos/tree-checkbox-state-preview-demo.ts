import {JsonPipe} from "@angular/common"
import {Component} from "@angular/core"

import {useTreeContext} from "@qualcomm-ui/angular-core/tree"
import {TreeModule} from "@qualcomm-ui/angular/tree"
import {createTreeCollection} from "@qualcomm-ui/core/tree"

interface Node {
  id: string
  nodes?: Node[]
  text: string
}

@Component({
  imports: [JsonPipe],
  selector: "tree-checked-state-display",
  template: `
    <pre class="font-code-sm mt-4 rounded p-2">{{
      treeContext().checkedValue | json
    }}</pre>
  `,
})
export class TreeCheckedStateDisplay {
  protected readonly treeContext = useTreeContext()
}

@Component({
  imports: [TreeModule, TreeCheckedStateDisplay],
  selector: "tree-checkbox-state-preview-demo",
  template: `
    <div
      class="w-full max-w-sm"
      q-tree-root
      [collection]="collection"
      [defaultCheckedValue]="['X1E-00-1DE', 'X1E-84-100']"
      [defaultExpandedValue]="['qualcomm', 'intel', 'amd']"
    >
      @for (
        node of collection.rootNode.nodes;
        let i = $index;
        track collection.getNodeValue(node)
      ) {
        <!-- preview -->
        <q-tree-nodes [indexPath]="[i]" [node]="node">
          <ng-template
            let-branch
            q-tree-branch-template
            [rootNode]="collection.rootNode"
          >
            <div q-tree-branch-node>
              <div q-tree-branch-trigger></div>
              <span q-tree-node-checkbox></span>
              <span q-tree-node-text>{{ branch.node.id }}</span>
            </div>
          </ng-template>

          <ng-template
            let-leaf
            q-tree-leaf-template
            [rootNode]="collection.rootNode"
          >
            <div q-tree-leaf-node>
              <span q-tree-node-checkbox></span>
              <span q-tree-node-text>{{ leaf.node.id }}</span>
            </div>
          </ng-template>
        </q-tree-nodes>
        <!-- preview -->
      }

      <tree-checked-state-display />
    </div>
  `,
})
export class TreeCheckboxStatePreviewDemo {
  collection = createTreeCollection<Node>({
    nodeText: "text",
    nodeValue: "id",
    rootNode: {
      id: "ROOT",
      nodes: [
        {
          id: "qualcomm",
          nodes: [
            {
              id: "snapdragon_x_elite",
              nodes: [
                {id: "X1E-00-1DE", text: "12-core X1E-00-1DE"},
                {id: "X1E-84-100", text: "12-core X1E-84-100"},
                {id: "X1E-80-100", text: "12-core X1E-80-100"},
                {id: "X1E-78-100", text: "12-core X1E-78-100"},
              ],
              text: "Snapdragon X Elite",
            },
            {
              id: "snapdragon_x_plus",
              nodes: [
                {id: "X1P-66-100", text: "10-core X1P-66-100"},
                {id: "X1P-64-100", text: "10-core X1P-64-100"},
                {id: "X1P-46-100", text: "8-core Plus X1P-46-100"},
                {id: "X1P-42-100", text: "8-core Plus X1P-42-100"},
              ],
              text: "Snapdragon X Plus",
            },
          ],
          text: "Qualcomm",
        },
        {
          id: "intel",
          nodes: [
            {
              id: "intel_core_ultra",
              nodes: [
                {id: "ultra9_s2", text: "Core Ultra 9 (Series 2)"},
                {id: "ultra7_s2", text: "Core Ultra 7 (Series 2)"},
                {id: "ultra5_s2", text: "Core Ultra 5 (Series 2)"},
              ],
              text: "Intel Core Ultra",
            },
            {
              id: "intel_core_i9",
              nodes: [
                {id: "i9_14th", text: "Core i9 14th Gen"},
                {id: "i9_13th", text: "Core i9 13th Gen"},
              ],
              text: "Intel Core i9",
            },
          ],
          text: "Intel",
        },
        {
          id: "amd",
          nodes: [
            {
              id: "amd_threadripper",
              nodes: [
                {
                  id: "threadripper_9000",
                  text: "Ryzen Threadripper 9000 Series",
                },
                {
                  id: "threadripper_7000",
                  text: "Ryzen Threadripper 7000 Series",
                },
              ],
              text: "AMD Threadripper",
            },
            {
              id: "amd_ryzen_9",
              nodes: [
                {id: "ryzen9_9000", text: "Ryzen 9 9000 Series"},
                {id: "ryzen9_7000", text: "Ryzen 9 7000 Series"},
              ],
              text: "AMD Ryzen 9",
            },
          ],
          text: "AMD",
        },
      ],
      text: "",
    },
  })
}
