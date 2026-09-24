import {type ReactNode, useState} from "react"

import {FileText, FolderIcon, MoreHorizontal} from "lucide-react"
import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {
  Tree,
  type TreeNodesProps,
  type TreeRootProps,
} from "@qualcomm-ui/react/tree"

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

interface RenderTestTreeOptions {
  children?: ReactNode
  collection?: ReturnType<typeof createTestCollection>
  renderBranch?: TreeNodesProps<TestNode>["renderBranch"]
  renderLeaf?: TreeNodesProps<TestNode>["renderLeaf"]
  rootProps?: Omit<TreeRootProps<TestNode>, "children" | "collection">
}

function renderTestTree({
  children,
  collection = createTestCollection(),
  renderBranch = ({node}) => (
    <Tree.BranchNode>
      <Tree.BranchTrigger />
      <Tree.NodeText>{node.text}</Tree.NodeText>
    </Tree.BranchNode>
  ),
  renderLeaf = ({node}) => (
    <Tree.LeafNode>
      <Tree.NodeText>{node.text}</Tree.NodeText>
    </Tree.LeafNode>
  ),
  rootProps,
}: RenderTestTreeOptions = {}) {
  return render(
    <Tree.Root collection={collection} {...rootProps}>
      {children}
      {collection.rootNode.nodes?.map((node, index) => (
        <Tree.Nodes
          key={node.id}
          indexPath={[index]}
          node={node}
          renderBranch={renderBranch}
          renderLeaf={renderLeaf}
        />
      ))}
    </Tree.Root>,
  )
}

describe("Tree", () => {
  test("renders all tree nodes correctly", async () => {
    const collection = createTestCollection()

    await render(
      <Tree.Root collection={collection}>
        {collection.rootNode.nodes?.map((node, index) => (
          <Tree.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <Tree.BranchNode>
                <Tree.BranchTrigger />
                <Tree.NodeIcon icon={FolderIcon} />
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.BranchNode>
            )}
            renderLeaf={({node}) => (
              <Tree.LeafNode>
                <Tree.NodeIcon icon={FileText} />
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.LeafNode>
            )}
          />
        ))}
      </Tree.Root>,
    )

    await expect.element(page.getByText("Documents")).toBeVisible()
    await expect.element(page.getByText("Images")).toBeVisible()
    await expect.element(page.getByText("Disabled Folder")).toBeVisible()
    await expect.element(page.getByText("README.md")).toBeVisible()

    await expect.element(page.getByText("Document 1.pdf")).not.toBeVisible()
    await expect.element(page.getByText("Image 1.jpg")).not.toBeVisible()
  })

  test("expands and collapses branch nodes", async () => {
    const collection = createTestCollection()

    await render(
      <Tree.Root collection={collection}>
        {collection.rootNode.nodes?.map((node, index) => (
          <Tree.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <Tree.BranchNode>
                <Tree.BranchTrigger />
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.BranchNode>
            )}
            renderLeaf={({node}) => (
              <Tree.LeafNode>
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.LeafNode>
            )}
          />
        ))}
      </Tree.Root>,
    )

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

    await render(
      <Tree.Root collection={collection} defaultExpandedValue={["documents"]}>
        {collection.rootNode.nodes?.map((node, index) => (
          <Tree.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <Tree.BranchNode>
                <Tree.BranchTrigger />
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.BranchNode>
            )}
            renderLeaf={({node}) => (
              <Tree.LeafNode>
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.LeafNode>
            )}
          />
        ))}
      </Tree.Root>,
    )

    // Documents should be expanded by default
    await expect.element(page.getByText("Document 1.pdf")).toBeVisible()
    await expect.element(page.getByText("Document 2.pdf")).toBeVisible()

    // Images should still be collapsed
    await expect.element(page.getByText("Image 1.jpg")).not.toBeVisible()
  })

  test("controlled expansion state", async () => {
    const collection = createTestCollection()

    function ControlledTree() {
      const [expandedValue, setExpandedValue] = useState<string[]>([])

      return (
        <div>
          <button onClick={() => setExpandedValue(["documents"])} type="button">
            Expand Documents
          </button>
          <Tree.Root
            collection={collection}
            expandedValue={expandedValue}
            onExpandedValueChange={({expandedValue}) =>
              setExpandedValue(expandedValue)
            }
          >
            {collection.rootNode.nodes?.map((node, index) => (
              <Tree.Nodes
                key={node.id}
                indexPath={[index]}
                node={node}
                renderBranch={({node}) => (
                  <Tree.BranchNode>
                    <Tree.BranchTrigger />
                    <Tree.NodeText>{node.text}</Tree.NodeText>
                  </Tree.BranchNode>
                )}
                renderLeaf={({node}) => (
                  <Tree.LeafNode>
                    <Tree.NodeText>{node.text}</Tree.NodeText>
                  </Tree.LeafNode>
                )}
              />
            ))}
          </Tree.Root>
        </div>
      )
    }

    await render(<ControlledTree />)

    await expect.element(page.getByText("Document 1.pdf")).not.toBeVisible()

    await page.getByRole("treeitem", {name: "Expand Documents"}).click()
    await expect.element(page.getByText("Document 1.pdf")).toBeVisible()
  })

  test("checkbox tree functionality", async () => {
    const collection = createTestCollection()

    await render(
      <Tree.Root
        collection={collection}
        defaultExpandedValue={["documents", "images"]}
      >
        {collection.rootNode.nodes?.map((node, index) => (
          <Tree.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <Tree.BranchNode>
                <Tree.BranchTrigger />
                <Tree.NodeCheckbox />
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.BranchNode>
            )}
            renderLeaf={({node}) => (
              <Tree.LeafNode>
                <Tree.NodeCheckbox />
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.LeafNode>
            )}
          />
        ))}
      </Tree.Root>,
    )

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

    await render(
      <Tree.Root collection={collection}>
        {collection.rootNode.nodes?.map((node, index) => (
          <Tree.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <Tree.BranchNode>
                <Tree.BranchTrigger />
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.BranchNode>
            )}
            renderLeaf={({node}) => (
              <Tree.LeafNode>
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.LeafNode>
            )}
          />
        ))}
      </Tree.Root>,
    )

    const disabledNode = page.getByText("Disabled Folder")
    await expect.element(disabledNode).toHaveAttribute("data-disabled", "")

    await disabledNode.click({force: true})
    await expect.element(page.getByText("Disabled File.txt")).not.toBeVisible()
  })

  test("selection functionality", async () => {
    const collection = createTestCollection()
    const onSelectionChange = vi.fn()

    await render(
      <Tree.Root
        collection={collection}
        onSelectedValueChange={onSelectionChange}
      >
        {collection.rootNode.nodes?.map((node, index) => (
          <Tree.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <Tree.BranchNode>
                <Tree.BranchTrigger />
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.BranchNode>
            )}
            renderLeaf={({node}) => (
              <Tree.LeafNode>
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.LeafNode>
            )}
          />
        ))}
      </Tree.Root>,
    )

    await page.getByText("README.md").click()
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({selectedValue: ["readme"]}),
    )
  })

  test("keyboard navigation", async () => {
    const collection = createTestCollection()

    await render(
      <Tree.Root collection={collection}>
        {collection.rootNode.nodes?.map((node, index) => (
          <Tree.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <Tree.BranchNode>
                <Tree.BranchTrigger />
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.BranchNode>
            )}
            renderLeaf={({node}) => (
              <Tree.LeafNode>
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.LeafNode>
            )}
          />
        ))}
      </Tree.Root>,
    )

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

    await render(
      <Tree.Root collection={collection} defaultExpandedValue={["documents"]}>
        {collection.rootNode.nodes?.map((node, index) => (
          <Tree.Nodes
            key={node.id}
            indentGuideProps={{"data-test-id": "indent-guide"}}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <Tree.BranchNode>
                <Tree.BranchTrigger />
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.BranchNode>
            )}
            renderLeaf={({node}) => (
              <Tree.LeafNode>
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.LeafNode>
            )}
            showIndentGuide
          />
        ))}
      </Tree.Root>,
    )

    const branchContent = page.getByTestId("indent-guide")
    for (const element of branchContent.elements()) {
      await expect.element(element).toBeInTheDocument()
    }
  })

  test("focus change callback", async () => {
    const collection = createTestCollection()
    const onFocusChange = vi.fn()

    await render(
      <Tree.Root collection={collection} onFocusChange={onFocusChange}>
        {collection.rootNode.nodes?.map((node, index) => (
          <Tree.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <Tree.BranchNode>
                <Tree.BranchTrigger />
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.BranchNode>
            )}
            renderLeaf={({node}) => (
              <Tree.LeafNode>
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.LeafNode>
            )}
          />
        ))}
      </Tree.Root>,
    )

    await userEvent.tab()
    expect(onFocusChange).toHaveBeenCalledWith(
      expect.objectContaining({focusedValue: "documents"}),
    )

    await page.getByText("Images").click()
    expect(onFocusChange).toHaveBeenCalledWith(
      expect.objectContaining({focusedValue: "images"}),
    )
  })

  test("labels the tree with a visible tree label", async () => {
    const collection = createTestCollection()

    await render(
      <Tree.Root collection={collection} size="sm">
        <Tree.Label>Project files</Tree.Label>
        {collection.rootNode.nodes?.map((node, index) => (
          <Tree.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <Tree.BranchNode>
                <Tree.BranchTrigger />
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.BranchNode>
            )}
            renderLeaf={({node}) => (
              <Tree.LeafNode>
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.LeafNode>
            )}
          />
        ))}
      </Tree.Root>,
    )

    await expect.element(page.getByText("Project files")).toBeVisible()
    await expect
      .element(page.getByText("Project files"))
      .toHaveAttribute("data-size", "sm")
    await expect
      .element(page.getByRole("tree", {name: "Project files"}))
      .toBeVisible()
  })

  test("provides the live tree api through render context", async () => {
    const collection = createTestCollection()

    await render(
      <Tree.Root collection={collection} defaultExpandedValue={["documents"]}>
        <Tree.Context>
          {(tree) => (
            <>
              <output data-test-id="expanded-value">
                {tree.expandedValue.join(",")}
              </output>
              <output data-test-id="visible-node-count">
                {tree.getVisibleNodes().length}
              </output>
            </>
          )}
        </Tree.Context>
        {collection.rootNode.nodes?.map((node, index) => (
          <Tree.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <Tree.BranchNode>
                <Tree.BranchTrigger />
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.BranchNode>
            )}
            renderLeaf={({node}) => (
              <Tree.LeafNode>
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.LeafNode>
            )}
          />
        ))}
      </Tree.Root>,
    )

    await expect
      .element(page.getByTestId("expanded-value"))
      .toHaveTextContent("documents")
    await expect
      .element(page.getByTestId("visible-node-count"))
      .toHaveTextContent("7")

    await page.getByText("Images").click()

    await expect
      .element(page.getByTestId("expanded-value"))
      .toHaveTextContent("documents,images")
    await expect
      .element(page.getByTestId("visible-node-count"))
      .toHaveTextContent("9")
  })

  test("node action does not select the node while indicator reflects selection", async () => {
    const collection = createTestCollection()
    const onNodeAction = vi.fn()
    const onSelectionChange = vi.fn()

    await render(
      <Tree.Root
        collection={collection}
        onSelectedValueChange={onSelectionChange}
      >
        {collection.rootNode.nodes?.map((node, index) => (
          <Tree.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <Tree.BranchNode>
                <Tree.BranchTrigger />
                <Tree.NodeText>{node.text}</Tree.NodeText>
              </Tree.BranchNode>
            )}
            renderLeaf={({node}) => (
              <Tree.LeafNode>
                <Tree.NodeIndicator data-test-id={`${node.id}-indicator`}>
                  {node.id === "readme" ? "Selected item" : null}
                </Tree.NodeIndicator>
                <Tree.NodeText>{node.text}</Tree.NodeText>
                {node.id === "readme" ? (
                  <Tree.NodeAction
                    aria-label="Open README actions"
                    icon={MoreHorizontal}
                    onClick={onNodeAction}
                  />
                ) : null}
              </Tree.LeafNode>
            )}
          />
        ))}
      </Tree.Root>,
    )

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
      .element(page.getByTestId("readme-indicator"))
      .toHaveAttribute("data-selected", "")
  })

  test("multiple selection supports shift range selection and modifier toggling", async () => {
    const onSelectionChange = vi.fn()

    await renderTestTree({
      rootProps: {
        defaultExpandedValue: ["documents"],
        onSelectedValueChange: onSelectionChange,
        selectionMode: "multiple",
      },
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
    const onSelectionChange = vi.fn()

    await renderTestTree({
      rootProps: {
        defaultExpandedValue: ["documents"],
        onSelectedValueChange: onSelectionChange,
        selectionMode: "multiple",
      },
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
    const onSelectionChange = vi.fn()

    await renderTestTree({
      renderBranch: ({node}) => (
        <Tree.BranchNode>
          <Tree.BranchTrigger data-test-id={`${node.id}-trigger`} />
          <Tree.NodeText>{node.text}</Tree.NodeText>
        </Tree.BranchNode>
      ),
      rootProps: {
        expandOnClick: false,
        onSelectedValueChange: onSelectionChange,
      },
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
    await renderTestTree({
      renderBranch: ({node}) => (
        <Tree.BranchNode>
          <Tree.BranchTrigger />
          <Tree.NodeCheckbox />
          <Tree.NodeText>{node.text}</Tree.NodeText>
        </Tree.BranchNode>
      ),
      renderLeaf: ({node}) => (
        <Tree.LeafNode>
          <Tree.NodeCheckbox />
          <Tree.NodeText>{node.text}</Tree.NodeText>
        </Tree.LeafNode>
      ),
      rootProps: {defaultExpandedValue: ["documents"]},
    })

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

  test("context api methods update machine expansion, selection, focus, and checked state", async () => {
    const onCheckedNodesChange = vi.fn()
    const onExpandedNodesChange = vi.fn()
    const onSelectedNodesChange = vi.fn()

    await renderTestTree({
      children: (
        <Tree.Context>
          {(tree) => (
            <>
              <output data-test-id="api-expanded">
                {tree.expandedValue.join(",") || "none"}
              </output>
              <output data-test-id="api-selected">
                {tree.selectedValue.join(",") || "none"}
              </output>
              <output data-test-id="api-checked">
                {tree.checkedValue.join(",") || "none"}
              </output>
              <output data-test-id="api-checked-map">
                {Array.from(tree.getCheckedMap())
                  .map(
                    ([value, state]) =>
                      `${value}:${state.type}:${state.checked}`,
                  )
                  .join("|")}
              </output>
              <button onClick={() => tree.expand(["documents"])} type="button">
                API expand documents
              </button>
              <button onClick={() => tree.expand()} type="button">
                API expand all
              </button>
              <button onClick={() => tree.collapse()} type="button">
                API collapse all
              </button>
              <button
                onClick={() => tree.collapse(["documents"])}
                type="button"
              >
                API collapse documents
              </button>
              <button
                onClick={() => tree.setExpandedValue(["documents"])}
                type="button"
              >
                API set expanded documents
              </button>
              <button
                onClick={() => tree.expandParent("report1")}
                type="button"
              >
                API expand report parent
              </button>
              <button
                onClick={() => tree.setSelectedValue(["doc1"])}
                type="button"
              >
                API set selected doc1
              </button>
              <button onClick={() => tree.selectParent("doc1")} type="button">
                API select doc1 parent
              </button>
              <button onClick={() => tree.deselect(["doc1"])} type="button">
                API deselect doc1
              </button>
              <button onClick={() => tree.deselect()} type="button">
                API deselect all
              </button>
              <button onClick={() => tree.select()} type="button">
                API select all
              </button>
              <button onClick={() => tree.setChecked(["doc1"])} type="button">
                API set checked doc1
              </button>
              <button
                onClick={() => tree.toggleChecked("documents", true)}
                type="button"
              >
                API toggle documents checked
              </button>
              <button onClick={() => tree.clearChecked()} type="button">
                API clear checked
              </button>
              <button onClick={() => tree.focus("images")} type="button">
                API focus images
              </button>
            </>
          )}
        </Tree.Context>
      ),
      rootProps: {
        onCheckedValueChange: (details) => {
          onCheckedNodesChange(details.checkedNodes.map((node) => node.id))
        },
        onExpandedValueChange: (details) => {
          onExpandedNodesChange(details.expandedNodes.map((node) => node.id))
        },
        onSelectedValueChange: (details) => {
          onSelectedNodesChange(details.selectedNodes.map((node) => node.id))
        },
        selectionMode: "multiple",
      },
    })

    await page.getByText("API expand documents").click()
    await expect
      .element(page.getByTestId("api-expanded"))
      .toHaveTextContent("documents")
    expect(onExpandedNodesChange).toHaveBeenLastCalledWith(["documents"])
    await expect.element(page.getByText("Document 1.pdf")).toBeVisible()

    await page.getByText("API expand all").click()
    await expect
      .element(page.getByTestId("api-expanded"))
      .toHaveTextContent(/documents.*reports.*images.*disabled-folder/)

    await page.getByText("API collapse all").click()
    await expect
      .element(page.getByTestId("api-expanded"))
      .toHaveTextContent("none")

    await page.getByText("API set expanded documents").click()
    await page.getByText("API expand report parent").click()
    await expect
      .element(page.getByTestId("api-expanded"))
      .toHaveTextContent("documents,reports")

    await page.getByText("API collapse documents").click()
    await expect
      .element(page.getByTestId("api-expanded"))
      .toHaveTextContent("reports")

    await page.getByText("API set selected doc1").click()
    await expect
      .element(page.getByTestId("api-selected"))
      .toHaveTextContent("doc1")
    expect(onSelectedNodesChange).toHaveBeenLastCalledWith(["doc1"])

    await page.getByText("API select doc1 parent").click()
    await expect
      .element(page.getByTestId("api-selected"))
      .toHaveTextContent("doc1,documents")

    await page.getByText("API deselect doc1").click()
    await expect
      .element(page.getByTestId("api-selected"))
      .toHaveTextContent("documents")

    await page.getByText("API deselect all").click()
    await expect
      .element(page.getByTestId("api-selected"))
      .toHaveTextContent("none")

    await page.getByText("API select all").click()
    await expect
      .element(page.getByTestId("api-selected"))
      .toHaveTextContent(/readme/)

    await page.getByText("API set checked doc1").click()
    await expect
      .element(page.getByTestId("api-checked"))
      .toHaveTextContent("doc1")
    expect(onCheckedNodesChange).toHaveBeenLastCalledWith(["doc1"])
    await expect
      .element(page.getByTestId("api-checked-map"))
      .toHaveTextContent(/documents:branch:indeterminate/)

    await page.getByText("API toggle documents checked").click()
    await expect
      .element(page.getByTestId("api-checked"))
      .toHaveTextContent(/doc2/)
    await expect
      .element(page.getByTestId("api-checked-map"))
      .toHaveTextContent(/documents:branch:true/)

    await page.getByText("API clear checked").click()
    await expect
      .element(page.getByTestId("api-checked"))
      .toHaveTextContent("none")

    await page.getByText("API focus images").click()
    expect(page.getByText("Images", {exact: true})).toHaveAttribute(
      "data-focus",
    )
  })

  test("context api expansion loads children asynchronously", async () => {
    interface LazyNode {
      children?: LazyNode[]
      childrenCount?: number
      id: string
      text: string
    }

    const initialCollection = createTreeCollection<LazyNode>({
      nodeChildren: "children",
      nodeText: "text",
      nodeValue: "id",
      rootNode: {
        children: [{childrenCount: 1, id: "lazy", text: "Lazy Folder"}],
        id: "ROOT",
        text: "",
      },
    })
    const loadChildren = vi.fn().mockResolvedValue([
      {
        id: "lazy-child",
        text: "Lazy Child.txt",
      },
    ])

    function LazyTree() {
      const [collection, setCollection] = useState(initialCollection)

      return (
        <Tree.Root
          collection={collection}
          loadChildren={loadChildren}
          onLoadChildrenComplete={({collection}) => setCollection(collection)}
        >
          <Tree.Context>
            {(tree) => (
              <button onClick={() => tree.expand(["lazy"])} type="button">
                Load lazy branch
              </button>
            )}
          </Tree.Context>
          {collection
            .getNodeChildren(collection.rootNode)
            .map((node, index) => (
              <Tree.Nodes
                key={node.id}
                indexPath={[index]}
                node={node}
                renderBranch={({node}) => (
                  <Tree.BranchNode>
                    <Tree.BranchTrigger />
                    <Tree.NodeText>{node.text}</Tree.NodeText>
                  </Tree.BranchNode>
                )}
                renderLeaf={({node}) => (
                  <Tree.LeafNode>
                    <Tree.NodeText>{node.text}</Tree.NodeText>
                  </Tree.LeafNode>
                )}
              />
            ))}
        </Tree.Root>
      )
    }

    await render(<LazyTree />)

    await page.getByText("Load lazy branch").click()

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
