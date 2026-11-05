import {Component} from "@angular/core"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {SideNavModule} from "@qualcomm-ui/angular/side-nav"

import {collection, icons} from "./items"
import {QLogoComponent} from "./q-logo.component"

@Component({
  imports: [SideNavModule, IconDirective, QLogoComponent],
  providers: [provideIcons(icons)],
  selector: "side-nav-default-expanded-demo",
  template: `
    <div class="flex justify-center">
      <!-- preview -->
      <div
        q-side-nav-root
        [collection]="collection"
        [defaultExpandedValue]="['account']"
      >
        <!-- preview -->
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
export class SideNavDefaultExpandedDemo {
  collection = collection
}
