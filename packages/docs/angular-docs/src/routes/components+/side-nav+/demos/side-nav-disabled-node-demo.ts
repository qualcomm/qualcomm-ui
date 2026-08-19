import {Component} from "@angular/core"
import {
  LucideBell,
  LucideCircleUser,
  LucideCreditCard,
  LucideLayoutDashboard,
  LucideNetwork,
  LucideShieldCheck,
  LucideUser,
} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {SideNavModule} from "@qualcomm-ui/angular/side-nav"
import {createTreeCollection} from "@qualcomm-ui/core/tree"

import {QLogoComponent} from "./q-logo.component"

interface SideNavItem {
  disabled?: boolean
  icon?: string
  id: string
  nodes?: SideNavItem[]
  text: string
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
      },
      {
        icon: "Network",
        id: "ai-studio",
        text: "AI Studio",
      },
      {
        icon: "CircleUser",
        id: "account",
        nodes: [
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
        text: "Account",
      },
    ],
    text: "",
  },
})

@Component({
  imports: [SideNavModule, IconDirective, QLogoComponent],
  providers: [
    provideIcons({
      LucideBell,
      LucideCircleUser,
      LucideCreditCard,
      LucideLayoutDashboard,
      LucideNetwork,
      LucideShieldCheck,
      LucideUser,
    }),
  ],
  selector: "side-nav-disabled-node-demo",
  template: `
    <div class="flex justify-center">
      <div
        q-side-nav-root
        [collection]="collection"
        [defaultExpandedValue]="['account']"
      >
        <div q-side-nav-header>
          <div q-side-nav-header-logo>
            <q-logo />
          </div>
          <div q-side-nav-header-title>Qualcomm</div>
        </div>

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
              <div q-side-nav-leaf-node>
                <div q-side-nav-node-indicator></div>
                @if (leaf.node.icon) {
                  <svg q-side-nav-node-icon [qIcon]="leaf.node.icon"></svg>
                }
                <span q-side-nav-node-text>{{ leaf.node.text }}</span>
              </div>
            </ng-template>
          </q-side-nav-nodes>
        }
      </div>
    </div>
  `,
})
export class SideNavDisabledNodeDemo {
  collection = collection
}
