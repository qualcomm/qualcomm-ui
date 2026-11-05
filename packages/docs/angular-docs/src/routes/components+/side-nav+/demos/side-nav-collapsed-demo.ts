import {Component, signal} from "@angular/core"
import {LucidePanelLeftClose, LucidePanelLeftOpen} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {SideNavModule} from "@qualcomm-ui/angular/side-nav"

import {collection, icons} from "./items"
import {QLogoComponent} from "./q-logo.component"

@Component({
  imports: [SideNavModule, IconDirective, ButtonModule, QLogoComponent],
  providers: [
    provideIcons({...icons, LucidePanelLeftClose, LucidePanelLeftOpen}),
  ],
  selector: "side-nav-collapsed-demo",
  template: `
    <div class="flex w-full justify-start">
      <!-- preview -->
      <div
        q-side-nav-root
        [collection]="collection"
        [open]="open()"
        (openChanged)="open.set($event)"
      >
        <div q-side-nav-header>
          <div q-side-nav-header-logo>
            <q-logo />
          </div>
          <div q-side-nav-header-title>Qualcomm</div>
          <button q-side-nav-collapse-trigger></button>
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
              <div q-side-nav-branch-node [attr.aria-label]="branch.node.text">
                <div q-side-nav-node-indicator></div>
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
              <div q-side-nav-leaf-node [attr.aria-label]="leaf.node.text">
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
      <!-- preview -->
    </div>
  `,
})
export class SideNavCollapsedDemo {
  collection = collection
  readonly open = signal(false)
}
