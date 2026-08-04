import {Component} from "@angular/core"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {SideNavModule} from "@qualcomm-ui/angular/side-nav"

import {groupedCollection, groupedIcons} from "./grouped-items"
import {QLogoComponent} from "./q-logo.component"

@Component({
  imports: [SideNavModule, IconDirective, QLogoComponent],
  providers: [provideIcons(groupedIcons)],
  selector: "side-nav-surface-demo",
  template: `
    <div class="flex justify-center">
      <div q-side-nav-root surface="secondary" [collection]="collection">
        <div q-side-nav-header>
          <div q-side-nav-header-logo>
            <q-logo />
          </div>
          <div q-side-nav-header-title>Qualcomm</div>
        </div>

        @for (group of groups; track group.key) {
          <div q-side-nav-group>
            <div q-side-nav-divider></div>

            @if (group.key !== "ungrouped") {
              <div q-side-nav-group-label>{{ group.key }}</div>
            }

            @for (
              item of group.items;
              track collection.getNodeValue(item.node)
            ) {
              <q-side-nav-nodes [indexPath]="item.indexPath" [node]="item.node">
                <ng-template
                  let-branch
                  q-side-nav-branch-template
                  [rootNode]="collection.rootNode"
                >
                  <div q-side-nav-branch-node>
                    <div q-side-nav-node-indicator></div>
                    @if (branch.node.icon) {
                      <svg
                        q-side-nav-node-icon
                        [qIcon]="branch.node.icon"
                      ></svg>
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
        }
      </div>
    </div>
  `,
})
export class SideNavSurfaceDemo {
  collection = groupedCollection

  groups = this.collection.groupChildren(
    [],
    (node) => node.group ?? "ungrouped",
    ["ungrouped", "Main menu"],
  )
}
