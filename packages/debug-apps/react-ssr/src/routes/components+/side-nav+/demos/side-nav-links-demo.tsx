/* eslint-disable perfectionist/sort-objects */

import {Link, useLocation} from "react-router"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {SideNav} from "@qualcomm-ui/react/side-nav"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"

import {QLogo} from "./q-logo"

interface SideNavItem {
  icon?: LucideIconOrElement
  id: string
  nodes?: SideNavItem[]
  pathname?: string
  text: string
}

const collection = createTreeCollection<SideNavItem>({
  nodeChildren: "nodes",
  nodeText: (node) => node.text,
  nodeValue: (node) => node.id,
  rootNode: {
    id: "ROOT",
    text: "",
    nodes: [
      {
        id: "components",
        text: "Components",
        nodes: [
          {
            id: "pagination",
            text: "Pagination",
            pathname: "/components/pagination",
          },
          {
            id: "side-nav",
            text: "Side Nav",
            pathname: "/components/side-nav",
          },
          {
            id: "switch",
            text: "Switch",
            pathname: "/components/switch",
          },
        ],
      },
    ],
  },
})

export default function Demo() {
  const pathname = useLocation().pathname

  const selectedNode = collection.findNodeBy(
    (node) => node.pathname === pathname,
  )

  return (
    <div className="flex justify-center">
      <SideNav.Root
        collection={collection}
        defaultExpandedValue={["components"]}
        selectedValue={selectedNode ? [selectedNode.id] : []}
      >
        <SideNav.Header>
          <SideNav.HeaderLogo>
            <QLogo />
          </SideNav.HeaderLogo>
          <SideNav.HeaderTitle>Qualcomm</SideNav.HeaderTitle>
        </SideNav.Header>

        {collection.rootNode.nodes?.map((parentNode, index) => (
          <SideNav.Nodes
            key={collection.getNodeValue(parentNode)}
            indexPath={[index]}
            node={parentNode}
            renderBranch={({node}) => (
              <SideNav.BranchNode>
                {node.icon ? <SideNav.NodeIcon icon={node.icon} /> : null}
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
                <SideNav.BranchTrigger />
              </SideNav.BranchNode>
            )}
            renderLeaf={({node}) => (
              // preview
              <SideNav.LeafNode
                render={node.pathname ? <Link to={node.pathname} /> : <div />}
              >
                <SideNav.NodeIndicator />
                {node.icon ? <SideNav.NodeIcon icon={node.icon} /> : null}
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
              // preview
            )}
            showIndentGuide
          />
        ))}
      </SideNav.Root>
    </div>
  )
}
