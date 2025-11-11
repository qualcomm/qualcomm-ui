import type {ReactElement} from "react"

import {FileText, FolderIcon} from "lucide-react"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {Tree, type TreeNodeProviderProps} from "@qualcomm-ui/react/tree"

interface Node {
  id: string
  name: string
  nodes?: Node[]
}

export default function Demo(): ReactElement {
  return (
    <Tree.Root className="w-full max-w-sm" collection={collection}>
      {collection.rootNode.nodes?.map((node, index) => {
        return <TreeNodes key={node.id} indexPath={[index]} node={node} />
      })}
    </Tree.Root>
  )
}

function TreeNodes(props: TreeNodeProviderProps<Node>): ReactElement {
  const {indexPath, node} = props
  const childNodes = collection.getNodeChildren(node)
  return (
    <Tree.NodeProvider {...props}>
      {childNodes.length ? (
        <Tree.Branch>
          <Tree.BranchNode>
            <Tree.NodeIndicator />
            <Tree.BranchTrigger />
            <Tree.NodeIcon icon={FolderIcon} />
            <Tree.NodeText>{collection.stringifyNode(node)}</Tree.NodeText>
          </Tree.BranchNode>
          <Tree.BranchContent>
            <Tree.BranchIndentGuide />
            {collection.getNodeChildren(node).map((childNode, index) => (
              <TreeNodes
                key={collection.getNodeValue(childNode)}
                indexPath={[...indexPath, index]}
                node={childNode}
              />
            ))}
          </Tree.BranchContent>
        </Tree.Branch>
      ) : (
        <Tree.LeafNode>
          <Tree.NodeIndicator />
          <Tree.NodeIcon icon={FileText} />
          <Tree.NodeText>{collection.stringifyNode(node)}</Tree.NodeText>
        </Tree.LeafNode>
      )}
    </Tree.NodeProvider>
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
