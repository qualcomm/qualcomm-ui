import type {ReactElement} from "react"

import {FileText, FolderIcon} from "lucide-react"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {Tree, type TreeNodeProviderProps} from "@qualcomm-ui/react/tree"

interface Node {
  id: string
  name: string
  nodes?: Node[]
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

export function TreeExplorerDemo(): ReactElement {
  return (
    <Tree.Root
      className="w-full max-w-xs"
      collection={collection}
      defaultExpandedValue={["src"]}
      defaultSelectedValue={["src/app.tsx"]}
    >
      {collection.rootNode.nodes?.map((node, index) => (
        <TreeNode key={node.id} indexPath={[index]} node={node} />
      ))}
    </Tree.Root>
  )
}

function TreeNode(props: TreeNodeProviderProps<Node>): ReactElement {
  const {indexPath, node} = props
  const childNodes = collection.getNodeChildren(node)
  return (
    <Tree.NodeProvider {...props}>
      {childNodes.length ? (
        <Tree.Branch>
          <Tree.BranchNode>
            <Tree.NodeIndicator />
            <Tree.BranchTrigger />
            <Tree.NodeCheckbox />
            <Tree.NodeIcon icon={FolderIcon} />
            <Tree.NodeText>{collection.stringifyNode(node)}</Tree.NodeText>
          </Tree.BranchNode>
          <Tree.BranchContent>
            <Tree.BranchIndentGuide />
            {childNodes.map((childNode, index) => (
              <TreeNode
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
          <Tree.NodeCheckbox />
          <Tree.NodeIcon icon={FileText} />
          <Tree.NodeText>{collection.stringifyNode(node)}</Tree.NodeText>
        </Tree.LeafNode>
      )}
    </Tree.NodeProvider>
  )
}
