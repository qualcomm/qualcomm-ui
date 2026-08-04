import type {ReactElement} from "react"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {Tree} from "@qualcomm-ui/react/tree"

interface Node {
  id: string
  nodes?: Node[]
  text: string
}

export function TreeCheckboxStatePreviewDemo(): ReactElement {
  return (
    <Tree.Root
      className="w-full max-w-sm"
      collection={collection}
      defaultCheckedValue={["X1E-00-1DE", "X1E-84-100"]}
      defaultExpandedValue={["qualcomm", "intel", "amd"]}
    >
      {collection.rootNode.nodes?.map((node, index) => {
        return (
          // preview
          <Tree.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <Tree.BranchNode>
                <Tree.BranchTrigger />
                <Tree.NodeCheckbox />
                <Tree.NodeText>{node.id}</Tree.NodeText>
              </Tree.BranchNode>
            )}
            renderLeaf={({node}) => (
              <Tree.LeafNode>
                <Tree.NodeCheckbox />
                <Tree.NodeText>{node.id}</Tree.NodeText>
              </Tree.LeafNode>
            )}
          />
          // preview
        )
      })}

      <Tree.Context>
        {(api) => (
          <CodeHighlight
            className="mt-4"
            code={JSON.stringify(api.checkedValue, null, 2)}
            language="json"
          />
        )}
      </Tree.Context>
    </Tree.Root>
  )
}

const collection = createTreeCollection<Node>({
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
