import {type ReactElement, useState} from "react"

import {FileText, FolderIcon, Plus, Trash} from "lucide-react"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {Tree, type TreeNodeProviderProps} from "@qualcomm-ui/react/tree"
import {useTreeContext} from "@qualcomm-ui/react-core/tree"

interface Node {
  id: string
  name: string
  nodes?: Node[]
}

export function TreeAddRemoveDemo(): ReactElement {
  const [collection, setCollection] = useState(initialCollection)

  const removeNode = (nodeProps: TreeNodeActionsProps) => {
    setCollection(collection.remove([nodeProps.indexPath]))
  }

  const addNode = (nodeProps: TreeNodeActionsProps) => {
    const {indexPath, node} = nodeProps
    if (!collection.isBranchNode(node)) {
      return
    }

    const nodes = [
      {
        id: `untitled-${Date.now()}`,
        name: `untitled-${node.nodes?.length}.tsx`,
      },
      ...(node.nodes || []),
    ]
    setCollection(collection.replace(indexPath, {...node, nodes}))
  }

  return (
    <Tree.Root className="w-full max-w-sm" collection={collection}>
      {collection.getNodeChildren(collection.rootNode).map((node, index) => {
        return (
          <Tree.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({indexPath, node}) => (
              <Tree.BranchNode role="treeitem">
                <Tree.NodeIndicator />
                <Tree.BranchTrigger />
                <Tree.NodeIcon icon={FolderIcon} />
                <Tree.NodeText>{collection.stringifyNode(node)}</Tree.NodeText>
                <TreeNodeActions
                  indexPath={indexPath}
                  node={node}
                  onAdd={addNode}
                  onRemove={removeNode}
                />
              </Tree.BranchNode>
            )}
            renderLeaf={({indexPath, node}) => (
              <Tree.LeafNode>
                <Tree.NodeIndicator />
                <Tree.NodeIcon icon={FileText} />
                <Tree.NodeText>{collection.stringifyNode(node)}</Tree.NodeText>
                <TreeNodeActions
                  indexPath={indexPath}
                  node={node}
                  onAdd={addNode}
                  onRemove={removeNode}
                />
              </Tree.LeafNode>
            )}
          />
        )
      })}
    </Tree.Root>
  )
}

interface TreeNodeActionsProps extends TreeNodeProviderProps<Node> {
  onAdd?: (props: TreeNodeProviderProps<Node>) => void
  onRemove?: (props: TreeNodeProviderProps<Node>) => void
}

function TreeNodeActions(props: TreeNodeActionsProps) {
  const {node, onAdd, onRemove} = props
  const tree = useTreeContext<Node>()
  const isBranch = tree.collection.isBranchNode(node)
  return (
    <>
      <Tree.NodeAction
        aria-label="Remove node"
        icon={Trash}
        onClick={() => {
          onRemove?.(props)
        }}
        size="sm"
      />
      {isBranch && (
        <Tree.NodeAction
          aria-label="Add node"
          icon={Plus}
          onClick={() => {
            onAdd?.(props)
            tree.expand([node.id])
          }}
          size="sm"
        />
      )}
    </>
  )
}

const initialCollection = createTreeCollection<Node>({
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
