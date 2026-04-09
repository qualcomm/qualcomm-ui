import {Component, inject} from "@angular/core"
import {Router, RouterLink} from "@angular/router"

import {SideNavModule} from "@qualcomm-ui/angular/side-nav"
import {createTreeCollection} from "@qualcomm-ui/core/tree"

import {QLogoComponent} from "./q-logo.component"

interface SideNavItem {
  icon?: string
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
    nodes: [
      {
        id: "components",
        nodes: [
          {
            id: "pagination",
            pathname: "/components/pagination",
            text: "Pagination",
          },
          {
            id: "side-nav",
            pathname: "/components/side-nav",
            text: "Side Nav",
          },
          {
            id: "switch",
            pathname: "/components/switch",
            text: "Switch",
          },
        ],
        text: "Components",
      },
    ],
    text: "",
  },
})

@Component({
  imports: [SideNavModule, RouterLink, QLogoComponent],
  selector: "side-nav-links-demo",
  template: `
    <div class="flex justify-center">
      <div
        q-side-nav-root
        [collection]="collection"
        [defaultExpandedValue]="['components']"
        [selectedValue]="selectedValue"
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
          <q-side-nav-nodes
            [indexPath]="[i]"
            [node]="node"
            [showIndentGuide]="true"
          >
            <ng-template
              let-branch
              q-side-nav-branch-template
              [rootNode]="collection.rootNode"
            >
              <div q-side-nav-branch-node>
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
              <a q-side-nav-leaf-node [routerLink]="leaf.node.pathname">
                <div q-side-nav-node-indicator></div>
                <span q-side-nav-node-text>{{ leaf.node.text }}</span>
              </a>
              <!-- preview -->
            </ng-template>
          </q-side-nav-nodes>
        }
      </div>
    </div>
  `,
})
export class SideNavLinksDemo {
  collection = collection
  private router = inject(Router)

  get selectedValue(): string[] {
    const pathname = this.router.url
    const selectedNode = collection.findNodeBy(
      (node) => node.pathname === pathname,
    )
    return selectedNode ? [selectedNode.id] : []
  }
}
