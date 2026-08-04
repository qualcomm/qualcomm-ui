import {Component, inject, output, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {TreeContextService} from "@qualcomm-ui/angular-core/tree"
import {TreeModule} from "@qualcomm-ui/angular/tree"
import {
  type CheckedChangeDetails,
  createTreeCollection,
  type ExpandedChangeDetails,
  type FocusChangeDetails,
  type SelectionChangeDetails,
} from "@qualcomm-ui/core/tree"

interface TestNode {
  childrenCount?: number
  disabled?: boolean
  id: string
  nodes?: TestNode[]
  text: string
}

const testTreeData: TestNode[] = [
  {
    id: "documents",
    nodes: [
      {id: "doc1", text: "Document 1.pdf"},
      {id: "doc2", text: "Document 2.pdf"},
      {
        id: "reports",
        nodes: [{id: "report1", text: "Report 1.docx"}],
        text: "Reports",
      },
    ],
    text: "Documents",
  },
  {
    id: "images",
    nodes: [
      {id: "img1", text: "Image 1.jpg"},
      {id: "img2", text: "Image 2.png"},
    ],
    text: "Images",
  },
  {
    disabled: true,
    id: "disabled-folder",
    nodes: [{id: "disabled-file", text: "Disabled File.txt"}],
    text: "Disabled Folder",
  },
  {id: "readme", text: "README.md"},
]

function createTestCollection() {
  return createTreeCollection<TestNode>({
    nodeChildren: "nodes",
    nodeDisabled: "disabled",
    nodeText: "text",
    nodeValue: "id",
    rootNode: {
      id: "ROOT",
      nodes: testTreeData,
      text: "",
    },
  })
}

@Component({
  selector: "test-tree-api-summary",
  standalone: true,
  template: `
    @if (treeContext.initialized()) {
      <output aria-label="Expanded value">
        {{ treeContext.context().expandedValue.join(",") || "none" }}
      </output>
      <output aria-label="Visible node count">
        {{ treeContext.context().getVisibleNodes().length }}
      </output>
    }
  `,
})
class TreeApiSummaryComponent {
  readonly treeContext = inject(TreeContextService<TestNode>)
}

@Component({
  selector: "test-tree-api-controls",
  standalone: true,
  template: `
    @if (treeContext.initialized()) {
      <output aria-label="API expanded value">
        {{ treeContext.context().expandedValue.join(",") || "none" }}
      </output>
      <output aria-label="API selected value">
        {{ treeContext.context().selectedValue.join(",") || "none" }}
      </output>
      <output aria-label="API checked value">
        {{ treeContext.context().checkedValue.join(",") || "none" }}
      </output>
      <output aria-label="API checked map">
        {{ checkedMapText() }}
      </output>
      <button (click)="treeContext.context().expand(['documents'])">
        API expand documents
      </button>
      <button (click)="treeContext.context().expand()">API expand all</button>
      <button (click)="treeContext.context().collapse()">
        API collapse all
      </button>
      <button (click)="treeContext.context().collapse(['documents'])">
        API collapse documents
      </button>
      <button (click)="treeContext.context().setExpandedValue(['documents'])">
        API set expanded documents
      </button>
      <button (click)="treeContext.context().expandParent('report1')">
        API expand report parent
      </button>
      <button (click)="treeContext.context().setSelectedValue(['doc1'])">
        API set selected doc1
      </button>
      <button (click)="treeContext.context().selectParent('doc1')">
        API select doc1 parent
      </button>
      <button (click)="treeContext.context().deselect(['doc1'])">
        API deselect doc1
      </button>
      <button (click)="treeContext.context().deselect()">
        API deselect all
      </button>
      <button (click)="treeContext.context().select()">API select all</button>
      <button (click)="treeContext.context().setChecked(['doc1'])">
        API set checked doc1
      </button>
      <button (click)="treeContext.context().toggleChecked('documents', true)">
        API toggle documents checked
      </button>
      <button (click)="treeContext.context().clearChecked()">
        API clear checked
      </button>
      <button (click)="treeContext.context().focus('images')">
        API focus images
      </button>
    }
  `,
})
class TreeApiControlsComponent {
  readonly treeContext = inject(TreeContextService<TestNode>)

  checkedMapText() {
    return (
      Array.from(this.treeContext.context().getCheckedMap())
        .map(([value, state]) => `${value}:${state.type}:${state.checked}`)
        .join("|") || "none"
    )
  }
}

describe("Tree", () => {
  test("renders all tree nodes correctly", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div q-tree-root [collection]="collection">
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
    }

    await render(TestComponent)

    await expect.element(page.getByText("Documents")).toBeVisible()
    await expect.element(page.getByText("Images")).toBeVisible()
    await expect.element(page.getByText("Disabled Folder")).toBeVisible()
    await expect.element(page.getByText("README.md")).toBeVisible()

    await expect.element(page.getByText("Document 1.pdf")).not.toBeVisible()
    await expect.element(page.getByText("Image 1.jpg")).not.toBeVisible()
  })

  test("expands and collapses branch nodes", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div q-tree-root [collection]="collection">
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
    }

    await render(TestComponent)

    await expect.element(page.getByText("Document 1.pdf")).not.toBeVisible()

    await page.getByText("Documents").click()
    await expect.element(page.getByText("Document 1.pdf")).toBeVisible()
    await expect.element(page.getByText("Document 2.pdf")).toBeVisible()
    await expect.element(page.getByText("Reports")).toBeVisible()

    await page.getByText("Documents").click()
    await expect.element(page.getByText("Document 1.pdf")).not.toBeVisible()
  })

  test("default expanded nodes", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div
          q-tree-root
          [collection]="collection"
          [defaultExpandedValue]="['documents']"
        >
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
    }

    await render(TestComponent)

    await expect.element(page.getByText("Document 1.pdf")).toBeVisible()
    await expect.element(page.getByText("Document 2.pdf")).toBeVisible()

    await expect.element(page.getByText("Image 1.jpg")).not.toBeVisible()
  })

  test("controlled expansion state", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <button (click)="expandedValue.set(['documents'])">
          Expand Documents
        </button>
        <div
          q-tree-root
          [collection]="collection"
          [expandedValue]="expandedValue()"
          (expandedValueChanged)="expandedValue.set($event.expandedValue)"
        >
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
      readonly expandedValue = signal<string[]>([])
    }

    await render(TestComponent)

    await expect.element(page.getByText("Document 1.pdf")).not.toBeVisible()

    await page.getByRole("treeitem", {name: "Expand Documents"}).click()
    await expect.element(page.getByText("Document 1.pdf")).toBeVisible()
  })

  test("checkbox tree functionality", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div
          q-tree-root
          [collection]="collection"
          [defaultExpandedValue]="['documents', 'images']"
        >
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-checkbox></span>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-checkbox></span>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
    }

    await render(TestComponent)

    const documentsCheckbox = page.getByLabelText("Documents")
    const doc1Checkbox = page.getByLabelText("Document 1.pdf")

    await expect.element(documentsCheckbox).not.toBeChecked()
    await expect.element(doc1Checkbox).not.toBeChecked()

    await doc1Checkbox.click()
    await expect.element(doc1Checkbox).toBeChecked()

    await expect
      .element(documentsCheckbox)
      .toHaveAttribute("data-state", "indeterminate")
  })

  test("disabled nodes", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div q-tree-root [collection]="collection">
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
    }

    await render(TestComponent)

    const disabledNode = page.getByText("Disabled Folder")
    await expect.element(disabledNode).toHaveAttribute("data-disabled", "")

    await disabledNode.click({force: true})
    await expect.element(page.getByText("Disabled File.txt")).not.toBeVisible()
  })

  test("selection functionality", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div
          q-tree-root
          [collection]="collection"
          (selectedValueChanged)="selectedValueChanged.emit($event)"
        >
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
      readonly selectedValueChanged = output<SelectionChangeDetails<TestNode>>()
    }

    const onSelectionChange = vi.fn()
    await render(TestComponent, {
      on: {selectedValueChanged: (details) => onSelectionChange(details)},
    })

    await page.getByText("README.md").click()
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({selectedValue: ["readme"]}),
    )
  })

  test("keyboard navigation", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div q-tree-root [collection]="collection">
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
    }

    await render(TestComponent)

    await userEvent.tab()
    expect(page.getByText("Documents")).toHaveAttribute("data-focus")

    await userEvent.keyboard("{ArrowDown}")
    expect(page.getByText("Images")).toHaveAttribute("data-focus")

    await userEvent.keyboard("{ArrowUp}")
    expect(page.getByText("Documents")).toHaveAttribute("data-focus")

    await userEvent.keyboard("{ArrowRight}")
    await expect.element(page.getByText("Document 1.pdf")).toBeVisible()

    await userEvent.keyboard("{ArrowLeft}")
    await expect.element(page.getByText("Document 1.pdf")).not.toBeVisible()
  })

  test("indent guide visibility", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div
          q-tree-root
          [collection]="collection"
          [defaultExpandedValue]="['documents']"
        >
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
                <div
                  data-test-id="indent-guide"
                  q-tree-branch-indent-guide
                ></div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
    }

    await render(TestComponent)

    const indentGuides = page.getByTestId("indent-guide")
    for (const element of indentGuides.elements()) {
      await expect.element(element).toBeInTheDocument()
    }
  })

  test("focus change callback", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div
          q-tree-root
          [collection]="collection"
          (focusChanged)="focusChanged.emit($event)"
        >
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
      readonly focusChanged = output<FocusChangeDetails<TestNode>>()
    }

    const onFocusChange = vi.fn()
    await render(TestComponent, {
      on: {focusChanged: (details) => onFocusChange(details)},
    })

    await userEvent.tab()
    expect(onFocusChange).toHaveBeenCalledWith(
      expect.objectContaining({focusedValue: "documents"}),
    )

    await page.getByText("Images").click()
    expect(onFocusChange).toHaveBeenCalledWith(
      expect.objectContaining({focusedValue: "images"}),
    )
  })

  test("expanded value change callback", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div
          q-tree-root
          [collection]="collection"
          (expandedValueChanged)="expandedValueChanged.emit($event)"
        >
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
      readonly expandedValueChanged = output<ExpandedChangeDetails<TestNode>>()
    }

    const onExpandedChange = vi.fn()
    await render(TestComponent, {
      on: {expandedValueChanged: (details) => onExpandedChange(details)},
    })

    await page.getByText("Documents").click()
    expect(onExpandedChange).toHaveBeenCalledWith(
      expect.objectContaining({expandedValue: ["documents"]}),
    )

    await page.getByText("Images").click()
    expect(onExpandedChange).toHaveBeenLastCalledWith(
      expect.objectContaining({expandedValue: ["documents", "images"]}),
    )
  })

  test("nested branch expansion", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div
          q-tree-root
          [collection]="collection"
          [defaultExpandedValue]="['documents']"
        >
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
    }

    await render(TestComponent)

    await expect.element(page.getByText("Reports")).toBeVisible()
    await expect.element(page.getByText("Report 1.docx")).not.toBeVisible()

    await page.getByText("Reports").click()
    await expect.element(page.getByText("Report 1.docx")).toBeVisible()
  })

  test("multiple selection mode", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div
          q-tree-root
          selectionMode="multiple"
          [collection]="collection"
          [defaultExpandedValue]="['documents']"
          (selectedValueChanged)="selectedValueChanged.emit($event)"
        >
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
      readonly selectedValueChanged = output<SelectionChangeDetails<TestNode>>()
    }

    const onSelectionChange = vi.fn()
    await render(TestComponent, {
      on: {selectedValueChanged: (details) => onSelectionChange(details)},
    })

    await page.getByText("Document 1.pdf").click()
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({selectedValue: ["doc1"]}),
    )

    await page.getByText("Document 2.pdf").click({modifiers: ["ControlOrMeta"]})
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({selectedValue: ["doc1", "doc2"]}),
    )
  })

  test("keyboard navigation with Home and End keys", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div q-tree-root [collection]="collection">
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
    }

    await render(TestComponent)

    await userEvent.tab()
    expect(page.getByText("Documents")).toHaveAttribute("data-focus")

    await userEvent.keyboard("{End}")
    expect(page.getByText("README.md")).toHaveAttribute("data-focus")

    await userEvent.keyboard("{Home}")
    expect(page.getByText("Documents")).toHaveAttribute("data-focus")
  })

  test("checkbox cascades selection to children", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div
          q-tree-root
          [collection]="collection"
          [defaultExpandedValue]="['documents']"
        >
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-checkbox></span>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-checkbox></span>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
    }

    await render(TestComponent)

    const documentsCheckbox = page.getByLabelText("Documents")
    const doc1Checkbox = page.getByLabelText("Document 1.pdf")
    const doc2Checkbox = page.getByLabelText("Document 2.pdf")

    await documentsCheckbox.click()

    await expect.element(documentsCheckbox).toBeChecked()
    await expect.element(doc1Checkbox).toBeChecked()
    await expect.element(doc2Checkbox).toBeChecked()
  })

  test("keyboard selection with Enter key", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div
          q-tree-root
          [collection]="collection"
          (selectedValueChanged)="selectedValueChanged.emit($event)"
        >
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
      readonly selectedValueChanged = output<SelectionChangeDetails<TestNode>>()
    }

    const onSelectionChange = vi.fn()
    await render(TestComponent, {
      on: {selectedValueChanged: (details) => onSelectionChange(details)},
    })

    await userEvent.tab()
    expect(page.getByText("Documents")).toHaveAttribute("data-focus")

    await userEvent.keyboard("{Enter}")
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({selectedValue: ["documents"]}),
    )
  })

  test("expand on click disabled", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div q-tree-root [collection]="collection" [expandOnClick]="false">
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
    }

    await render(TestComponent)

    await page.getByText("Documents").click()
    await expect.element(page.getByText("Document 1.pdf")).not.toBeVisible()
  })

  test("labels the tree with a visible tree label", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div q-tree-root size="sm" [collection]="collection">
          <div q-tree-label>Project files</div>
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
    }

    await render(TestComponent)

    await expect.element(page.getByText("Project files")).toBeVisible()
    await expect
      .element(page.getByRole("tree", {name: "Project files"}))
      .toBeVisible()
  })

  test("context api exposes expanded value and visible node count", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule, TreeApiSummaryComponent],
      template: `
        <div
          q-tree-root
          [collection]="collection"
          [defaultExpandedValue]="['documents']"
        >
          <test-tree-api-summary />
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
    }

    await render(TestComponent)

    await expect
      .element(page.getByLabelText("Expanded value"))
      .toHaveTextContent("documents")
    await expect
      .element(page.getByLabelText("Visible node count"))
      .toHaveTextContent("7")

    await page.getByText("Images").click()

    await expect
      .element(page.getByLabelText("Expanded value"))
      .toHaveTextContent("documents,images")
    await expect
      .element(page.getByLabelText("Visible node count"))
      .toHaveTextContent("9")
  })

  test("node action does not select the node while indicator reflects selection", async () => {
    const collection = createTestCollection()
    const onNodeAction = vi.fn()

    @Component({
      imports: [TreeModule],
      template: `
        <div
          q-tree-root
          [collection]="collection"
          (selectedValueChanged)="selectedValueChanged.emit($event)"
        >
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator>
                    @if (leaf.node.id === "readme") {
                      Selected item
                    }
                  </div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                  @if (leaf.node.id === "readme") {
                    <button
                      aria-label="Open README actions"
                      q-tree-node-action
                      (click)="nodeAction()"
                    ></button>
                  }
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
      readonly nodeAction = onNodeAction
      readonly selectedValueChanged = output<SelectionChangeDetails<TestNode>>()
    }

    const onSelectionChange = vi.fn()
    await render(TestComponent, {
      on: {selectedValueChanged: (details) => onSelectionChange(details)},
    })

    await expect.element(page.getByText("Selected item")).not.toBeVisible()

    await page.getByRole("button", {name: "Open README actions"}).click()
    expect(onNodeAction).toHaveBeenCalledTimes(1)
    expect(onSelectionChange).not.toHaveBeenCalled()

    await page.getByText("README.md").click()
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({selectedValue: ["readme"]}),
    )
    await expect.element(page.getByText("Selected item")).toBeVisible()
    await expect
      .element(page.getByText("Selected item"))
      .toHaveAttribute("data-selected", "")
  })

  test("multiple selection supports shift range selection and modifier toggling", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div
          q-tree-root
          selectionMode="multiple"
          [collection]="collection"
          [defaultExpandedValue]="['documents']"
          (selectedValueChanged)="selectedValueChanged.emit($event)"
        >
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
      readonly selectedValueChanged = output<SelectionChangeDetails<TestNode>>()
    }

    const onSelectionChange = vi.fn()
    await render(TestComponent, {
      on: {selectedValueChanged: (details) => onSelectionChange(details)},
    })

    await expect
      .element(page.getByRole("tree"))
      .toHaveAttribute("aria-multiselectable", "true")

    await page.getByText("Document 1.pdf").click()
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({selectedValue: ["doc1"]}),
    )

    await page.getByText("Document 2.pdf").click({modifiers: ["Shift"]})
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({selectedValue: ["doc1", "doc2"]}),
    )

    await page.getByText("Document 2.pdf").click({modifiers: ["ControlOrMeta"]})
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({selectedValue: ["doc1"]}),
    )
  })

  test("keyboard commands select, move to boundaries, search, and expand siblings", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div
          q-tree-root
          selectionMode="multiple"
          [collection]="collection"
          [defaultExpandedValue]="['documents']"
          (selectedValueChanged)="selectedValueChanged.emit($event)"
        >
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
      readonly selectedValueChanged = output<SelectionChangeDetails<TestNode>>()
    }

    const onSelectionChange = vi.fn()
    await render(TestComponent, {
      on: {selectedValueChanged: (details) => onSelectionChange(details)},
    })

    await userEvent.tab()
    expect(page.getByText("Documents")).toHaveAttribute("data-focus")

    await userEvent.keyboard("{ArrowRight}")
    expect(page.getByText("Document 1.pdf")).toHaveAttribute("data-focus")

    await userEvent.keyboard("{Enter}")
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({selectedValue: ["doc1"]}),
    )

    await userEvent.keyboard("{Shift>}{ArrowDown}{/Shift}")
    expect(page.getByText("Document 2.pdf")).toHaveAttribute("data-focus")
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({selectedValue: ["doc1", "doc2"]}),
    )

    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}")
    expect(page.getByText("Document 1.pdf")).toHaveAttribute("data-focus")
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({selectedValue: ["doc1"]}),
    )

    await userEvent.keyboard("{ArrowLeft}")
    expect(page.getByText("Documents")).toHaveAttribute("data-focus")

    await userEvent.keyboard("{ArrowRight}")
    expect(page.getByText("Document 1.pdf")).toHaveAttribute("data-focus")

    await userEvent.keyboard("{End}")
    expect(page.getByText("README.md")).toHaveAttribute("data-focus")

    await userEvent.keyboard("{Enter}")
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({selectedValue: ["readme"]}),
    )

    await userEvent.keyboard("{Shift>}{Home}{/Shift}")
    expect(page.getByText("Documents")).toHaveAttribute("data-focus")
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        selectedValue: expect.arrayContaining(["documents", "readme"]),
      }),
    )

    await userEvent.keyboard("{Shift>}{End}{/Shift}")
    expect(page.getByText("README.md")).toHaveAttribute("data-focus")
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        selectedValue: expect.arrayContaining(["documents", "readme"]),
      }),
    )

    await userEvent.keyboard("{Home}")
    expect(page.getByText("Documents")).toHaveAttribute("data-focus")

    await userEvent.keyboard("r")
    expect(page.getByText("Reports")).toHaveAttribute("data-focus")

    await userEvent.keyboard("{Home}")
    await userEvent.keyboard("*")
    await expect.element(page.getByText("Image 1.jpg")).toBeVisible()
  })

  test("branch click can select without expanding when expand on click is disabled", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div
          q-tree-root
          [collection]="collection"
          [expandOnClick]="false"
          (selectedValueChanged)="selectedValueChanged.emit($event)"
        >
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div
                    q-tree-branch-trigger
                    [attr.data-test-id]="branch.node.id + '-trigger'"
                  ></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
      readonly selectedValueChanged = output<SelectionChangeDetails<TestNode>>()
    }

    const onSelectionChange = vi.fn()
    await render(TestComponent, {
      on: {selectedValueChanged: (details) => onSelectionChange(details)},
    })

    await page.getByText("Documents").click()

    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({selectedValue: ["documents"]}),
    )
    await expect.element(page.getByText("Document 1.pdf")).not.toBeVisible()

    await page.getByTestId("documents-trigger").click()
    await expect.element(page.getByText("Document 1.pdf")).toBeVisible()
  })

  test("branch checkbox cascades checked state to descendants", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule],
      template: `
        <div
          q-tree-root
          [collection]="collection"
          [defaultExpandedValue]="['documents', 'reports']"
        >
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-checkbox></span>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span q-tree-node-checkbox></span>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
    }

    await render(TestComponent)

    const documentsCheckbox = page.getByLabelText("Documents")
    const doc1Checkbox = page.getByLabelText("Document 1.pdf")
    const doc2Checkbox = page.getByLabelText("Document 2.pdf")
    const report1Checkbox = page.getByLabelText("Report 1.docx")

    await documentsCheckbox.click()

    await expect.element(documentsCheckbox).toBeChecked()
    await expect.element(doc1Checkbox).toBeChecked()
    await expect.element(doc2Checkbox).toBeChecked()
    await expect.element(report1Checkbox).toBeChecked()
  })

  test("context api methods update expansion, selection, focus, and checked state", async () => {
    const collection = createTestCollection()

    @Component({
      imports: [TreeModule, TreeApiControlsComponent],
      template: `
        <div
          q-tree-root
          selectionMode="multiple"
          [collection]="collection"
          (checkedValueChanged)="checkedValueChanged.emit($event)"
          (expandedValueChanged)="expandedValueChanged.emit($event)"
          (selectedValueChanged)="selectedValueChanged.emit($event)"
        >
          <test-tree-api-controls />
          @for (
            node of collection.rootNode.nodes;
            let i = $index;
            track collection.getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span data-test-id="tree-node-text" q-tree-node-text>
                    {{ branch.node.text }}
                  </span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection.rootNode"
              >
                <div q-tree-leaf-node>
                  <div q-tree-node-indicator></div>
                  <span data-test-id="tree-node-text" q-tree-node-text>
                    {{ leaf.node.text }}
                  </span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = collection
      readonly checkedValueChanged = output<CheckedChangeDetails<TestNode>>()
      readonly expandedValueChanged = output<ExpandedChangeDetails<TestNode>>()
      readonly selectedValueChanged = output<SelectionChangeDetails<TestNode>>()
    }

    const onCheckedChange = vi.fn()
    const onExpandedChange = vi.fn()
    const onSelectedChange = vi.fn()
    await render(TestComponent, {
      on: {
        checkedValueChanged: (details) => onCheckedChange(details),
        expandedValueChanged: (details) => onExpandedChange(details),
        selectedValueChanged: (details) => onSelectedChange(details),
      },
    })

    await page.getByRole("button", {name: "API expand documents"}).click()
    await expect
      .element(page.getByLabelText("API expanded value"))
      .toHaveTextContent("documents")
    expect(onExpandedChange).toHaveBeenLastCalledWith(
      expect.objectContaining({expandedValue: ["documents"]}),
    )
    await expect.element(page.getByText("Document 1.pdf")).toBeVisible()

    await page.getByRole("button", {name: "API expand all"}).click()
    await expect
      .element(page.getByLabelText("API expanded value"))
      .toHaveTextContent(/documents.*reports.*images.*disabled-folder/)

    await page.getByRole("button", {name: "API collapse all"}).click()
    await expect
      .element(page.getByLabelText("API expanded value"))
      .toHaveTextContent("none")

    await page.getByRole("button", {name: "API set expanded documents"}).click()
    await page.getByRole("button", {name: "API expand report parent"}).click()
    await expect
      .element(page.getByLabelText("API expanded value"))
      .toHaveTextContent("documents,reports")

    await page.getByRole("button", {name: "API collapse documents"}).click()
    await expect
      .element(page.getByLabelText("API expanded value"))
      .toHaveTextContent("reports")

    await page.getByRole("button", {name: "API set selected doc1"}).click()
    await expect
      .element(page.getByLabelText("API selected value"))
      .toHaveTextContent("doc1")
    expect(onSelectedChange).toHaveBeenLastCalledWith(
      expect.objectContaining({selectedValue: ["doc1"]}),
    )

    await page.getByRole("button", {name: "API select doc1 parent"}).click()
    await expect
      .element(page.getByLabelText("API selected value"))
      .toHaveTextContent("doc1,documents")

    await page.getByRole("button", {name: "API deselect doc1"}).click()
    await expect
      .element(page.getByLabelText("API selected value"))
      .toHaveTextContent("documents")

    await page.getByRole("button", {name: "API deselect all"}).click()
    await expect
      .element(page.getByLabelText("API selected value"))
      .toHaveTextContent("none")

    await page.getByRole("button", {name: "API select all"}).click()
    await expect
      .element(page.getByLabelText("API selected value"))
      .toHaveTextContent(/readme/)

    await page.getByRole("button", {name: "API set checked doc1"}).click()
    await expect
      .element(page.getByLabelText("API checked value"))
      .toHaveTextContent("doc1")
    expect(onCheckedChange).toHaveBeenLastCalledWith(
      expect.objectContaining({checkedValue: ["doc1"]}),
    )
    await expect
      .element(page.getByLabelText("API checked map"))
      .toHaveTextContent(/documents:branch:indeterminate/)

    await page
      .getByRole("button", {name: "API toggle documents checked"})
      .click()
    await expect
      .element(page.getByLabelText("API checked value"))
      .toHaveTextContent(/doc2/)
    await expect
      .element(page.getByLabelText("API checked map"))
      .toHaveTextContent(/documents:branch:true/)

    await page.getByRole("button", {name: "API clear checked"}).click()
    await expect
      .element(page.getByLabelText("API checked value"))
      .toHaveTextContent("none")

    await page.getByRole("button", {name: "API focus images"}).click()
    const imagesNodeText = page
      .getByTestId("tree-node-text")
      .filter({hasText: "Images"})
    await expect.element(imagesNodeText).toHaveAttribute("data-focus")
  })

  test("context api expansion loads children asynchronously", async () => {
    interface LazyNode {
      childrenCount?: number
      id: string
      nodes?: LazyNode[]
      text: string
    }

    const initialCollection = createTreeCollection<LazyNode>({
      nodeChildren: "nodes",
      nodeText: "text",
      nodeValue: "id",
      rootNode: {
        id: "ROOT",
        nodes: [{childrenCount: 1, id: "lazy", text: "Lazy Folder"}],
        text: "",
      },
    })
    const loadChildren = vi.fn().mockResolvedValue([
      {
        id: "lazy-child",
        text: "Lazy Child.txt",
      },
    ])

    @Component({
      selector: "test-lazy-tree-api",
      standalone: true,
      template: `
        @if (treeContext.initialized()) {
          <button (click)="treeContext.context().expand(['lazy'])">
            Load lazy branch
          </button>
        }
      `,
    })
    class LazyTreeApiComponent {
      readonly treeContext = inject(TreeContextService<LazyNode>)
    }

    @Component({
      imports: [TreeModule, LazyTreeApiComponent],
      template: `
        <div
          q-tree-root
          [collection]="collection()"
          [loadChildren]="loadChildren"
          (loadChildrenComplete)="collection.set($event.collection)"
        >
          <test-lazy-tree-api />
          @for (
            node of collection().rootNode.nodes;
            let i = $index;
            track collection().getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template
                let-branch
                q-tree-branch-template
                [rootNode]="collection().rootNode"
              >
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-text>{{ branch.node.text }}</span>
                </div>
              </ng-template>

              <ng-template
                let-leaf
                q-tree-leaf-template
                [rootNode]="collection().rootNode"
              >
                <div q-tree-leaf-node>
                  <span q-tree-node-text>{{ leaf.node.text }}</span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly collection = signal(initialCollection)
      readonly loadChildren = loadChildren
    }

    await render(TestComponent)

    await page.getByRole("button", {name: "Load lazy branch"}).click()

    expect(loadChildren).toHaveBeenCalledWith(
      expect.objectContaining({
        indexPath: [0],
        node: expect.objectContaining({id: "lazy"}),
        valuePath: ["lazy"],
      }),
    )
    await expect.element(page.getByText("Lazy Child.txt")).toBeVisible()
  })
})
