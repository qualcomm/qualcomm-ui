import {type HTMLAttributes, useState} from "react"

import {FileText, FolderIcon} from "lucide-react"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"
import {render} from "vitest-browser-react"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {Tree} from "@qualcomm-ui/react/tree"

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

    await page.getByRole("button", {name: "Expand Documents"}).click()
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
            indentGuideProps={
              {"data-test-id": "indent-guide"} as HTMLAttributes<HTMLElement>
            }
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
})
