import {Component, output, signal} from "@angular/core"
import {FormsModule} from "@angular/forms"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {SideNavModule} from "@qualcomm-ui/angular/side-nav"
import {TextInputModule} from "@qualcomm-ui/angular/text-input"
import {createTreeCollection} from "@qualcomm-ui/core/tree"

interface TestNode {
  disabled?: boolean
  id: string
  nodes?: TestNode[]
  text: string
}

const testSideNavData: TestNode[] = [
  {
    id: "home",
    text: "Home",
  },
  {
    id: "documents",
    nodes: [
      {id: "doc1", text: "Document 1"},
      {id: "doc2", text: "Document 2"},
      {
        id: "reports",
        nodes: [{id: "report1", text: "Report 1"}],
        text: "Reports",
      },
    ],
    text: "Documents",
  },
  {
    id: "settings",
    nodes: [
      {id: "profile", text: "Profile"},
      {id: "account", text: "Account"},
    ],
    text: "Settings",
  },
  {
    disabled: true,
    id: "disabled-section",
    nodes: [{id: "disabled-item", text: "Disabled Item"}],
    text: "Disabled Section",
  },
]

function createTestCollection() {
  return createTreeCollection<TestNode>({
    nodeChildren: "nodes",
    nodeDisabled: "disabled",
    nodeText: "text",
    nodeValue: "id",
    rootNode: {
      id: "ROOT",
      nodes: testSideNavData,
      text: "",
    },
  })
}

describe("SideNav", () => {
  test("filter input can drive visible navigation results", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [FormsModule, SideNavModule, TextInputModule],
      template: `
        <div q-side-nav-root [collection]="collection">
          <q-text-input
            label="Search"
            placeholder="Search"
            q-side-nav-filter-input
            [ngModel]="query()"
            (ngModelChange)="query.set($event)"
          />

          @for (
            node of visibleNodes();
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
                  <div q-side-nav-branch-trigger></div>
                  <span q-side-nav-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-side-nav-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-side-nav-leaf-node>
                  <span q-side-nav-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-side-nav-nodes>
          }
        </div>
      `,
    })
    class FilterableSideNavComponent {
      readonly collection = collection
      readonly query = signal("")

      visibleNodes() {
        return (
          this.collection.rootNode.nodes?.filter((node) =>
            node.text.toLowerCase().includes(this.query().toLowerCase()),
          ) ?? []
        )
      }
    }

    await render(FilterableSideNavComponent)

    const searchInput = page.getByLabelText("Search")
    await expect.element(searchInput).toHaveAttribute("placeholder", "Search")

    await userEvent.type(searchInput, "settings")

    await expect.element(searchInput).toHaveValue("settings")
    await expect.element(page.getByText("Settings")).toBeVisible()
    await expect.element(page.getByText("Home")).not.toBeInTheDocument()
    await expect.element(page.getByText("Documents")).not.toBeInTheDocument()
  })

  test("renders grouped sections with labels and dividers", async () => {
    const collection = createTestCollection()
    const homeNode = testSideNavData[0]

    @Component({
      imports: [SideNavModule],
      template: `
        <div q-side-nav-root [collection]="collection">
          <div q-side-nav-group>
            <div q-side-nav-group-label>Main menu</div>
            <div q-side-nav-divider></div>

            <q-side-nav-nodes [indexPath]="[0]" [node]="homeNode">
              <ng-template
                let-branch
                q-side-nav-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-side-nav-branch-node>
                  <div q-side-nav-branch-trigger></div>
                  <span q-side-nav-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-side-nav-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-side-nav-leaf-node>
                  <span q-side-nav-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-side-nav-nodes>
          </div>
        </div>
      `,
    })
    class GroupedSideNavComponent {
      readonly collection = collection
      readonly homeNode = homeNode
    }

    await render(GroupedSideNavComponent)

    await expect.element(page.getByText("Main menu")).toBeVisible()
    await expect.element(page.getByText("Home")).toBeVisible()
    await expect.element(page.getByRole("presentation")).toBeInTheDocument()
  })

  test("node action does not select a node while accessory and indicator reflect node state", async () => {
    const collection = createTestCollection()
    const onNodeAction = vi.fn()
    const onSelectionChange = vi.fn()

    @Component({
      imports: [SideNavModule],
      template: `
        <div
          q-side-nav-root
          [collection]="collection"
          (selectedValueChanged)="selectedValueChanged.emit($event)"
        >
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
                  <div q-side-nav-branch-trigger></div>
                  <span q-side-nav-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-side-nav-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-side-nav-leaf-node>
                  <div q-side-nav-node-indicator>
                    @if (leaf.node.id === "home") {
                      Current
                    }
                  </div>
                  <span q-side-nav-node-text>{{ leaf.node.text }}</span>
                  @if (leaf.node.id === "home") {
                    <span q-side-nav-node-accessory>2 unread</span>
                    <button
                      aria-label="Open Home actions"
                      q-side-nav-node-action
                      type="button"
                      (click)="nodeActionClicked.emit()"
                    >
                      More
                    </button>
                  }
                </div>
              </ng-template>
            </q-side-nav-nodes>
          }
        </div>
      `,
    })
    class ActionSideNavComponent {
      readonly collection = collection
      readonly nodeActionClicked = output<void>()
      readonly selectedValueChanged = output<any>()
    }

    await render(ActionSideNavComponent, {
      on: {
        nodeActionClicked: () => onNodeAction(),
        selectedValueChanged: (event) => onSelectionChange(event),
      },
    })

    await expect.element(page.getByText("2 unread")).toBeVisible()
    await expect.element(page.getByText("Current")).not.toBeVisible()

    await page.getByRole("button", {name: "Open Home actions"}).click()
    expect(onNodeAction).toHaveBeenCalledTimes(1)
    expect(onSelectionChange).not.toHaveBeenCalled()

    await page.getByText("Home").click()
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({selectedValue: ["home"]}),
    )
    await expect.element(page.getByText("Current")).toBeVisible()
  })
})
