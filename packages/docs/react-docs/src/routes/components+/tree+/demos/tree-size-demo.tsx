import type {ReactElement} from "react"

import {FileText, FolderIcon} from "lucide-react"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {Tree} from "@qualcomm-ui/react/tree"

interface Node {
  id: string
  name: string
  nodes?: Node[]
}

export default function Demo(): ReactElement {
  return (
    <div className="flex w-full flex-col gap-4">
      <Tree.Root className="w-full max-w-sm" collection={collection} size="sm">
        <Tree.Label>Small (sm)</Tree.Label>
        <TreeContent />
      </Tree.Root>

      <Tree.Root className="w-full max-w-sm" collection={collection} size="md">
        <Tree.Label>Medium (md)</Tree.Label>
        <TreeContent />
      </Tree.Root>
    </div>
  )
}

function TreeContent() {
  return (
    <>
      {collection.rootNode.nodes?.map((parentNode, index) => {
        return (
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
                <Tree.NodeIcon icon={FileText} />
                <Tree.NodeText>{node.name}</Tree.NodeText>
              </Tree.LeafNode>
            )}
          />
        )
      })}
    </>
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
        id: "node_modules",
        name: "node_modules",
        nodes: [
          {
            id: "@qui",
            name: "@qui",
            nodes: [
              {id: "node_modules/@qualcomm-ui/core", name: "@qualcomm-ui/core"},
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
