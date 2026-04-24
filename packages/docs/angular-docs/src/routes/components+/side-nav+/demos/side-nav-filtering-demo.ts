import {Component, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"
import {Search} from "lucide-angular"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {SideNavModule} from "@qualcomm-ui/angular/side-nav"
import {TextInputModule} from "@qualcomm-ui/angular/text-input"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import type {TreeCollection} from "@qualcomm-ui/utils/collection"
import {matchSorter} from "@qualcomm-ui/utils/match-sorter"

import {
  groupedIcons,
  groupedCollection as initialCollection,
  type SideNavItem,
} from "./grouped-items"
import {QLogoComponent} from "./q-logo.component"

@Component({
  imports: [
    SideNavModule,
    IconDirective,
    TextInputModule,
    FormsModule,
    QLogoComponent,
  ],
  providers: [provideIcons({...groupedIcons, Search})],
  selector: "side-nav-filtering-demo",
  template: `
    <div class="flex justify-center">
      <!-- preview -->
      <div
        q-side-nav-root
        [collection]="collection()"
        [expandedValue]="expanded()"
        (expandedValueChanged)="expanded.set($event.expandedValue)"
      >
        <div q-side-nav-header>
          <div q-side-nav-header-logo>
            <q-logo />
          </div>
          <div q-side-nav-header-title>Qualcomm</div>
        </div>

        <hr q-side-nav-divider />

        <q-text-input
          placeholder="Search"
          q-side-nav-filter-input
          size="sm"
          startIcon="Search"
          style="margin-bottom: 16px"
          [ngModel]="query()"
          (ngModelChange)="search($event)"
        />

        @for (group of groups(); track group.key) {
          <div q-side-nav-group>
            <hr q-side-nav-divider />

            @if (group.key !== "ungrouped") {
              <div q-side-nav-group-label>{{ group.key }}</div>
            }

            @for (
              item of group.items;
              track collection().getNodeValue(item.node)
            ) {
              <q-side-nav-nodes [indexPath]="item.indexPath" [node]="item.node">
                <ng-template
                  let-branch
                  q-side-nav-branch-template
                  [rootNode]="collection().rootNode"
                >
                  <div q-side-nav-branch-node>
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
                  [rootNode]="collection().rootNode"
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
      <!-- preview -->
    </div>
  `,
})
export class SideNavFilteringDemo {
  readonly initialCollection = initialCollection
  readonly collection = signal<TreeCollection<SideNavItem>>(initialCollection)
  readonly expanded = signal<string[]>([])
  readonly query = signal("")

  readonly groups = signal(
    initialCollection.groupChildren([], (node) => node.group ?? "ungrouped", [
      "ungrouped",
      "Main menu",
    ]),
  )

  search(value: string) {
    this.query.set(value)

    if (!value) {
      this.collection.set(initialCollection)
      this.groups.set(
        initialCollection.groupChildren(
          [],
          (node) => node.group ?? "ungrouped",
          ["ungrouped", "Main menu"],
        ),
      )
      return
    }

    const nodes = matchSorter<SideNavItem>(
      initialCollection.getDescendantNodes(),
      value,
      {
        keys: [
          "group",
          "text",
          "category",
          (item) => {
            return initialCollection
              .getParentNodes(item.id)
              .map((node) => node.group)
              .filter(Boolean) as string[]
          },
        ],
      },
    )

    const nextCollection = initialCollection.filter((node) =>
      nodes.some((n) => n.id === node.id),
    )
    this.collection.set(nextCollection)
    this.expanded.set(nextCollection.getBranchValues())
    this.groups.set(
      nextCollection.groupChildren([], (node) => node.group ?? "ungrouped", [
        "ungrouped",
        "Main menu",
      ]),
    )
  }
}
