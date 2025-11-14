/* eslint-disable perfectionist/sort-objects */
import {
  Bell,
  CircleUser,
  CreditCard,
  LayoutDashboard,
  Network,
  ShieldCheck,
  User,
} from "lucide-react"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {SideNav} from "@qualcomm-ui/react/side-nav"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"

import {QLogo} from "./q-logo"

export interface SideNavItem {
  disabled?: boolean
  group?: string
  icon?: LucideIconOrElement
  id: string
  nodes?: SideNavItem[]
  text: string
}

export const collection = createTreeCollection<SideNavItem>({
  nodeChildren: "nodes",
  nodeText: (node) => node.text,
  nodeValue: (node) => node.id,
  rootNode: {
    id: "ROOT",
    text: "",
    nodes: [
      {
        icon: Bell,
        id: "notifications",
        text: "Notifications",
      },
      {
        icon: LayoutDashboard,
        id: "dashboard",
        text: "Dashboard",
        disabled: true,
      },
      {
        icon: Network,
        id: "ai-studio",
        text: "AI Studio",
      },
      {
        icon: CircleUser,
        id: "account",
        text: "Account",
        nodes: [
          {
            icon: User,
            id: "profile",
            text: "Profile",
          },
          {
            icon: ShieldCheck,
            id: "security",
            text: "Security",
          },
          {
            icon: CreditCard,
            id: "billing",
            text: "Billing",
          },
        ],
      },
    ],
  },
})

export default function Demo() {
  return (
    <div className="flex justify-center">
      <SideNav.Root collection={collection} defaultExpandedValue={["account"]}>
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
              <SideNav.LeafNode>
                <SideNav.NodeIndicator />
                {node.icon ? <SideNav.NodeIcon icon={node.icon} /> : null}
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
            )}
          />
        ))}
      </SideNav.Root>
    </div>
  )
}
