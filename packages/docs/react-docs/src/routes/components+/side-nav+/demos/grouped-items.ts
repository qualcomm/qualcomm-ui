/* eslint-disable perfectionist/sort-objects */
import {
  Bell,
  Boxes,
  ChartPie,
  CreditCard,
  Grid2x2,
  Key,
  LayoutDashboard,
  Link,
  Network,
  Settings2,
  ShieldCheck,
  User,
  Webhook,
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
        icon: Settings2,
        id: "settings",
        text: "Settings",
      },
      {
        group: "Main menu",
        icon: LayoutDashboard,
        id: "dashboard",
        text: "Dashboard",
      },
      {
        group: "Main menu",
        icon: Network,
        id: "ai-studio",
        text: "AI Studio",
      },
      {
        group: "Main menu",
        icon: ChartPie,
        id: "data-analysis",
        text: "Data Analysis",
      },
      {
        group: "Main menu",
        icon: Boxes,
        id: "integrations",
        text: "Integrations",
        nodes: [
          {
            icon: Grid2x2,
            id: "marketplace",
            text: "Marketplace",
          },
          {
            icon: Link,
            id: "connected",
            text: "Connected Apps",
          },
          {
            icon: Key,
            id: "api-keys",
            text: "API Keys",
          },
          {
            icon: Webhook,
            id: "webhooks",
            text: "Webhooks",
          },
        ],
      },
      {
        group: "Administration",
        icon: User,
        id: "profile",
        text: "Profile",
      },
      {
        group: "Administration",
        icon: ShieldCheck,
        id: "security",
        text: "Security",
      },
      {
        group: "Administration",
        icon: CreditCard,
        id: "billing",
        text: "Billing",
      },
    ],
  },
})
