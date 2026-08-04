import {Component} from "@angular/core"
import {
  Bell,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  User,
} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {SideNavModule} from "@qualcomm-ui/angular/side-nav"
import {TooltipModule} from "@qualcomm-ui/angular/tooltip"
import {createTreeCollection} from "@qualcomm-ui/core/tree"

interface SideNavItem {
  disabled?: boolean
  icon?: string
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
    nodes: [
      {
        icon: "Bell",
        id: "notifications",
        text: "Notifications",
      },
      {
        disabled: true,
        icon: "LayoutDashboard",
        id: "dashboard",
        text: "Dashboard",
        tooltip: "The dashboard is planned for a future update",
      },
      {
        icon: "User",
        id: "profile",
        text: "Profile",
      },
      {
        icon: "ShieldCheck",
        id: "security",
        text: "Security",
      },
      {
        icon: "CreditCard",
        id: "billing",
        text: "Billing",
      },
    ],
    text: "",
  },
})

@Component({
  imports: [SideNavModule, IconDirective, TooltipModule],
  providers: [
    provideIcons({Bell, CreditCard, LayoutDashboard, ShieldCheck, User}),
  ],
  selector: "side-nav-tooltip-demo",
  template: `
    <div class="flex justify-center">
      <div q-side-nav-root [collection]="collection" [open]="false">
        @for (
          node of collection.rootNode.nodes;
          let i = $index;
          track collection.getNodeValue(node)
        ) {
          <q-side-nav-nodes [indexPath]="[i]" [node]="node">
            <ng-template
              let-branch
              q-side-nav-branch-template
              [rootNode]="collection.rootNode"
            >
              <div q-side-nav-branch-node>
                @if (branch.node.icon) {
                  <svg q-side-nav-node-icon [qIcon]="branch.node.icon"></svg>
                }
                <span q-side-nav-node-text>{{ branch.node.text }}</span>
                <div q-side-nav-branch-trigger></div>
              </div>
            </ng-template>

            <ng-template
              let-leaf
              q-side-nav-leaf-template
              [rootNode]="collection.rootNode"
            >
              <!-- preview -->
              <div q-tooltip>
                <span q-tooltip-trigger>
                  <div q-side-nav-leaf-node>
                    <div q-side-nav-node-indicator></div>
                    @if (leaf.node.icon) {
                      <svg q-side-nav-node-icon [qIcon]="leaf.node.icon"></svg>
                    }
                    <span q-side-nav-node-text>{{ leaf.node.text }}</span>
                  </div>
                </span>
                {{ leaf.node.tooltip || leaf.node.text }}
              </div>
              <!-- preview -->
            </ng-template>
          </q-side-nav-nodes>
        }
      </div>
    </div>
  `,
})
export class SideNavTooltipDemo {
  collection = collection
}
