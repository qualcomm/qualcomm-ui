import {type ReactElement, useState} from "react"

import {FileTextIcon, Folder, FolderOpen} from "lucide-react"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {Tree, type TreeRootProps} from "@qualcomm-ui/react/tree"

interface Item {
  items?: Item[]
  name: string
}

interface FileTreeProps extends Omit<TreeRootProps, "collection"> {
  items: Item[]
}

export function FileTree({
  defaultExpandedValue,
  items,
  ...props
}: FileTreeProps): ReactElement {
  const [expandedValue, setExpandedValue] = useState(defaultExpandedValue ?? [])

  const collection = createTreeCollection<Item>({
    nodeChildren: "items",
    nodeText: "name",
    nodeValue: "name",
    rootNode: {
      items,
      name: "ROOT",
    },
  })

  return (
    <Tree.Root
      collection={collection}
      expandedValue={expandedValue}
      onExpandedValueChange={(details) =>
        setExpandedValue(details.expandedValue)
      }
      {...props}
    >
      {collection.rootNode.items?.map((item, index) => (
        <Tree.Nodes
          key={item.name}
          indexPath={[index]}
          node={item}
          renderBranch={({node}) => {
            const isExpanded = expandedValue.includes(node.name)

            return (
              <Tree.BranchNode>
                <Tree.NodeIcon icon={isExpanded ? FolderOpen : Folder} />
                <Tree.NodeIndicator />
                <Tree.BranchTrigger />
                <Tree.NodeText>{node.name}</Tree.NodeText>
              </Tree.BranchNode>
            )
          }}
          renderLeaf={({node}) => (
            <Tree.LeafNode>
              <Tree.NodeIcon icon={FileTextIcon} />
              <Tree.NodeIndicator />
              <Tree.NodeText>{node.name}</Tree.NodeText>
            </Tree.LeafNode>
          )}
        />
      ))}
    </Tree.Root>
  )
}
