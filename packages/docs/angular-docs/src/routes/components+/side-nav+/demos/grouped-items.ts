import {
  LucideBell,
  LucideBoxes,
  LucideChartPie,
  LucideCreditCard,
  LucideGrid2x2,
  LucideKey,
  LucideLayoutDashboard,
  LucideLink,
  LucideNetwork,
  LucideSettings2,
  LucideShieldCheck,
  LucideUser,
  LucideWebhook,
} from "@lucide/angular"

import {createTreeCollection} from "@qualcomm-ui/core/tree"

export interface SideNavItem {
  category?: string
  group?: string
  icon?: string
  id: string
  nodes?: SideNavItem[]
  text: string
}

export const groupedCollection = createTreeCollection<SideNavItem>({
  nodeChildren: "nodes",
  nodeText: (node) => node.text,
  nodeValue: (node) => node.id,
  rootNode: {
    id: "ROOT",
    nodes: [
      {
        icon: "Bell",
        id: "notifications",
        text: "Notifications",
      },
      {
        icon: "Settings2",
        id: "settings",
        text: "Settings",
      },
      {
        group: "Main menu",
        icon: "LayoutDashboard",
        id: "dashboard",
        text: "Dashboard",
      },
      {
        group: "Main menu",
        icon: "Network",
        id: "ai-studio",
        text: "AI Studio",
      },
      {
        group: "Main menu",
        icon: "ChartPie",
        id: "data-analysis",
        text: "Data Analysis",
      },
      {
        group: "Main menu",
        icon: "Boxes",
        id: "integrations",
        nodes: [
          {
            category: "integrations",
            icon: "Grid2x2",
            id: "marketplace",
            text: "Marketplace",
          },
          {
            category: "integrations",
            icon: "Link",
            id: "connected",
            text: "Connected Apps",
          },
          {
            category: "integrations",
            icon: "Key",
            id: "api-keys",
            text: "API Keys",
          },
          {
            category: "integrations",
            icon: "Webhook",
            id: "webhooks",
            text: "Webhooks",
          },
        ],
        text: "Integrations",
      },
      {
        group: "Administration",
        icon: "User",
        id: "profile",
        text: "Profile",
      },
      {
        group: "Administration",
        icon: "ShieldCheck",
        id: "security",
        text: "Security",
      },
      {
        group: "Administration",
        icon: "CreditCard",
        id: "billing",
        text: "Billing",
      },
    ],
    text: "",
  },
})

export const groupedIcons = {
  LucideBell,
  LucideBoxes,
  LucideChartPie,
  LucideCreditCard,
  LucideGrid2x2,
  LucideKey,
  LucideLayoutDashboard,
  LucideLink,
  LucideNetwork,
  LucideSettings2,
  LucideShieldCheck,
  LucideUser,
  LucideWebhook,
}
