/* eslint-disable perfectionist/sort-objects */
import {
  Bell,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  User,
} from "lucide-react"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {SideNav} from "@qualcomm-ui/react/side-nav"
import {Tooltip} from "@qualcomm-ui/react/tooltip"

interface SideNavItem {
  disabled?: boolean
  group?: string
  icon?: LucideIconOrElement
  id: string
  nodes?: SideNavItem[]
  text: string
  tooltip?: string
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
        icon: Bell,
        id: "notifications",
        text: "Notifications",
      },
      {
        icon: LayoutDashboard,
        id: "dashboard",
        text: "Dashboard",
        disabled: true,
        tooltip: "The dashboard is planned for a future update",
      },
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
})

export function SideNavTooltipDemo() {
  return (
    <div className="flex justify-center">
      <SideNav.Root collection={collection} open={false}>
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
            renderLeaf={({node}) => {
              return (
                // preview
                <Tooltip
                  trigger={
                    <span>
                      <SideNav.LeafNode>
                        <SideNav.NodeIndicator />
                        {node.icon ? (
                          <SideNav.NodeIcon icon={node.icon} />
                        ) : null}
                        <SideNav.NodeText>{node.text}</SideNav.NodeText>
                      </SideNav.LeafNode>
                    </span>
                  }
                >
                  {node.tooltip || node.text}
                </Tooltip>
                // preview
              )
            }}
          />
        ))}
      </SideNav.Root>
    </div>
  )
}
