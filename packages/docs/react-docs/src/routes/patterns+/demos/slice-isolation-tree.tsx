import type {ReactElement} from "react"

import {FolderIcon} from "lucide-react"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {Tree} from "@qualcomm-ui/react/tree"

interface Node {
  id: string
  name: string
  nodes?: Node[]
}

export function SliceIsolationTree(): ReactElement {
  return (
    <Tree.Root
      className="w-full max-w-sm"
      collection={collection}
      expandedValue={["entities", "user", "internal-user", "external-user"]}
      selectedValue={[]}
    >
      {collection.rootNode.nodes?.map((parentNode, index) => (
        <Tree.Nodes
          key={parentNode.id}
          indexPath={[index]}
          node={parentNode}
          renderBranch={({node}) => (
            <Tree.BranchNode>
              <Tree.NodeIndicator />
              <Tree.BranchTrigger />
              <Tree.NodeIcon icon={FolderIcon} />
              <Tree.NodeText>{node.name}</Tree.NodeText>
            </Tree.BranchNode>
          )}
          renderLeaf={({node}) => (
            <Tree.LeafNode>
              <Tree.NodeIndicator />
              <Tree.NodeIcon icon={FolderIcon} />
              <Tree.NodeText>{node.name}</Tree.NodeText>
            </Tree.LeafNode>
          )}
          showIndentGuide
        />
      ))}
    </Tree.Root>
  )
}

const collection = createTreeCollection<Node>({
  nodeChildren: "nodes",
  nodeText: (node) => node.name,
  nodeValue: (node) => node.id,
  rootNode: {
    id: "ROOT",
    name: "",
    nodes: [
      {
        id: "entities",
        name: "entities",
        nodes: [
          {
            id: "user",
            name: "user",
            nodes: [
              {
                id: "internal-user",
                name: "internal-user",
                nodes: [
                  {id: "model", name: "model", nodes: []},
                  {id: "ui", name: "ui", nodes: []},
                ],
              },
              {
                id: "external-user",
                name: "external-user",
                nodes: [
                  {id: "model-external", name: "model", nodes: []},
                  {id: "ui-external", name: "ui", nodes: []},
                ],
              },
            ],
          },
        ],
      },
    ],
  },
})
