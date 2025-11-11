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
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"

export interface SideNavItem {
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
