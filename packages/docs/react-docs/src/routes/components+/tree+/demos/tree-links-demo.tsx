import type {ReactElement} from "react"

import {Link} from "react-router"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {Tree} from "@qualcomm-ui/react/tree"

interface Node {
  id: string
  name: string
  nodes?: Node[]
  pathname?: string
}

export function TreeLinksDemo(): ReactElement {
  return (
    <Tree.Root
      className="w-full max-w-sm"
      collection={collection}
      defaultExpandedValue={["components"]}
    >
      {collection.rootNode.nodes?.map((parentNode, index) => {
        return (
          <Tree.Nodes
            key={parentNode.id}
            indexPath={[index]}
            node={parentNode}
            renderBranch={({node}) => {
              return (
                <Tree.BranchNode
                  render={node.pathname ? <Link to={node.pathname} /> : <div />}
                >
                  <Tree.NodeIndicator />
                  <Tree.BranchTrigger />
                  <Tree.NodeText>{node.name}</Tree.NodeText>
                </Tree.BranchNode>
              )
            }}
            renderLeaf={({node}) => {
              return (
                // preview
                <Tree.LeafNode
                  render={node.pathname ? <Link to={node.pathname} /> : <div />}
                >
                  <Tree.NodeIndicator />
                  <Tree.NodeText>{node.name}</Tree.NodeText>
                </Tree.LeafNode>
                // preview
              )
            }}
          />
        )
      })}
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
        id: "components",
        name: "Components",
        nodes: [
          {id: "switch", name: "Switch", pathname: "/components/switch"},
          {id: "tooltip", name: "Tooltip", pathname: "/components/tooltip"},
          {id: "tree", name: "Tree", pathname: "/components/tree"},
        ],
      },
    ],
  },
})
