import {Component, output, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {TreeModule} from "@qualcomm-ui/angular/tree"
import {
  createTreeCollection,
  type ExpandedChangeDetails,
  type FocusChangeDetails,
  type SelectionChangeDetails,
} from "@qualcomm-ui/core/tree"

interface TestNode {
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
})
