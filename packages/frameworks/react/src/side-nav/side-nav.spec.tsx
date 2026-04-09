import {type HTMLAttributes, useState} from "react"

import {FileText, FolderIcon} from "lucide-react"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"
import {render} from "vitest-browser-react"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {SideNav} from "@qualcomm-ui/react/side-nav"

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
  test("renders all navigation nodes correctly", async () => {
    const collection = createTestCollection()

    await render(
      <SideNav.Root collection={collection}>
        {collection.rootNode.nodes?.map((node, index) => (
          <SideNav.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <SideNav.BranchNode>
                <SideNav.BranchTrigger />
                <SideNav.NodeIcon icon={FolderIcon} />
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.BranchNode>
            )}
            renderLeaf={({node}) => (
              <SideNav.LeafNode>
                <SideNav.NodeIcon icon={FileText} />
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
            )}
          />
        ))}
      </SideNav.Root>,
    )

    await expect.element(page.getByText("Home")).toBeVisible()
    await expect.element(page.getByText("Documents")).toBeVisible()
    await expect.element(page.getByText("Settings")).toBeVisible()
    await expect.element(page.getByText("Disabled Section")).toBeVisible()

    await expect.element(page.getByText("Document 1")).not.toBeVisible()
    await expect.element(page.getByText("Profile")).not.toBeVisible()
  })

  test("expands and collapses branch nodes", async () => {
    const collection = createTestCollection()

    await render(
      <SideNav.Root collection={collection}>
        {collection.rootNode.nodes?.map((node, index) => (
          <SideNav.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <SideNav.BranchNode>
                <SideNav.BranchTrigger />
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.BranchNode>
            )}
            renderLeaf={({node}) => (
              <SideNav.LeafNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
            )}
          />
        ))}
      </SideNav.Root>,
    )

    await expect.element(page.getByText("Document 1")).not.toBeVisible()

    await page.getByText("Documents").click()
    await expect.element(page.getByText("Document 1")).toBeVisible()
    await expect.element(page.getByText("Document 2")).toBeVisible()
    await expect.element(page.getByText("Reports")).toBeVisible()

    await page.getByText("Documents").click()
    await expect.element(page.getByText("Document 1")).not.toBeVisible()
  })

  test("default expanded nodes", async () => {
    const collection = createTestCollection()

    await render(
      <SideNav.Root
        collection={collection}
        defaultExpandedValue={["documents"]}
      >
        {collection.rootNode.nodes?.map((node, index) => (
          <SideNav.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <SideNav.BranchNode>
                <SideNav.BranchTrigger />
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.BranchNode>
            )}
            renderLeaf={({node}) => (
              <SideNav.LeafNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
            )}
          />
        ))}
      </SideNav.Root>,
    )

    await expect.element(page.getByText("Document 1")).toBeVisible()
    await expect.element(page.getByText("Document 2")).toBeVisible()

    await expect.element(page.getByText("Profile")).not.toBeVisible()
  })

  test("controlled expansion state", async () => {
    const collection = createTestCollection()

    function ControlledSideNav() {
      const [expandedValue, setExpandedValue] = useState<string[]>([])

      return (
        <div>
          <button onClick={() => setExpandedValue(["settings"])} type="button">
            Expand Settings
          </button>
          <SideNav.Root
            collection={collection}
            expandedValue={expandedValue}
            onExpandedValueChange={({expandedValue}) =>
              setExpandedValue(expandedValue)
            }
          >
            {collection.rootNode.nodes?.map((node, index) => (
              <SideNav.Nodes
                key={node.id}
                indexPath={[index]}
                node={node}
                renderBranch={({node}) => (
                  <SideNav.BranchNode>
                    <SideNav.BranchTrigger />
                    <SideNav.NodeText>{node.text}</SideNav.NodeText>
                  </SideNav.BranchNode>
                )}
                renderLeaf={({node}) => (
                  <SideNav.LeafNode>
                    <SideNav.NodeText>{node.text}</SideNav.NodeText>
                  </SideNav.LeafNode>
                )}
              />
            ))}
          </SideNav.Root>
        </div>
      )
    }

    await render(<ControlledSideNav />)

    await expect.element(page.getByText("Profile")).not.toBeVisible()

    await page.getByRole("treeitem", {name: "Expand Settings"}).click()
    await expect.element(page.getByText("Profile")).toBeVisible()
    await expect.element(page.getByText("Account")).toBeVisible()
  })

  test("disabled nodes", async () => {
    const collection = createTestCollection()

    await render(
      <SideNav.Root collection={collection}>
        {collection.rootNode.nodes?.map((node, index) => (
          <SideNav.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <SideNav.BranchNode>
                <SideNav.BranchTrigger />
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.BranchNode>
            )}
            renderLeaf={({node}) => (
              <SideNav.LeafNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
            )}
          />
        ))}
      </SideNav.Root>,
    )

    const disabledNode = page.getByText("Disabled Section")
    await expect.element(disabledNode).toHaveAttribute("data-disabled", "")

    await disabledNode.click({force: true})
    await expect.element(page.getByText("Disabled Item")).not.toBeVisible()
  })

  test("selection functionality", async () => {
    const collection = createTestCollection()
    const onSelectionChange = vi.fn()

    await render(
      <SideNav.Root
        collection={collection}
        onSelectedValueChange={onSelectionChange}
      >
        {collection.rootNode.nodes?.map((node, index) => (
          <SideNav.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <SideNav.BranchNode>
                <SideNav.BranchTrigger />
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.BranchNode>
            )}
            renderLeaf={({node}) => (
              <SideNav.LeafNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
            )}
          />
        ))}
      </SideNav.Root>,
    )

    await page.getByText("Home").click()
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({selectedValue: ["home"]}),
    )
  })

  test("keyboard navigation", async () => {
    const collection = createTestCollection()

    await render(
      <SideNav.Root collection={collection}>
        {collection.rootNode.nodes?.map((node, index) => (
          <SideNav.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <SideNav.BranchNode>
                <SideNav.BranchTrigger />
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.BranchNode>
            )}
            renderLeaf={({node}) => (
              <SideNav.LeafNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
            )}
          />
        ))}
      </SideNav.Root>,
    )

    await userEvent.tab()
    expect(page.getByText("Home")).toHaveAttribute("data-focus")

    await userEvent.keyboard("{ArrowDown}")
    expect(page.getByText("Documents")).toHaveAttribute("data-focus")

    await userEvent.keyboard("{ArrowUp}")
    expect(page.getByText("Home")).toHaveAttribute("data-focus")

    await userEvent.keyboard("{ArrowDown}")
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(page.getByText("Document 1")).toBeVisible()

    await userEvent.keyboard("{ArrowLeft}")
    await expect.element(page.getByText("Document 1")).not.toBeVisible()
  })

  test("indent guide visibility", async () => {
    const collection = createTestCollection()

    await render(
      <SideNav.Root
        collection={collection}
        defaultExpandedValue={["documents"]}
      >
        {collection.rootNode.nodes?.map((node, index) => (
          <SideNav.Nodes
            key={node.id}
            indentGuideProps={
              {"data-test-id": "indent-guide"} as HTMLAttributes<HTMLElement>
            }
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <SideNav.BranchNode>
                <SideNav.BranchTrigger />
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.BranchNode>
            )}
            renderLeaf={({node}) => (
              <SideNav.LeafNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
            )}
            showIndentGuide
          />
        ))}
      </SideNav.Root>,
    )

    const indentGuides = page.getByTestId("indent-guide")
    for (const element of indentGuides.elements()) {
      await expect.element(element).toBeInTheDocument()
    }
  })

  test("focus change callback", async () => {
    const collection = createTestCollection()
    const onFocusChange = vi.fn()

    await render(
      <SideNav.Root collection={collection} onFocusChange={onFocusChange}>
        {collection.rootNode.nodes?.map((node, index) => (
          <SideNav.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <SideNav.BranchNode>
                <SideNav.BranchTrigger />
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.BranchNode>
            )}
            renderLeaf={({node}) => (
              <SideNav.LeafNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
            )}
          />
        ))}
      </SideNav.Root>,
    )

    await userEvent.tab()
    expect(onFocusChange).toHaveBeenCalledWith(
      expect.objectContaining({focusedValue: "home"}),
    )

    await page.getByText("Documents").click()
    expect(onFocusChange).toHaveBeenCalledWith(
      expect.objectContaining({focusedValue: "documents"}),
    )
  })

  test("renders header with logo and title", async () => {
    const collection = createTestCollection()

    await render(
      <SideNav.Root collection={collection}>
        <SideNav.Header data-test-id="side-nav-header">
          <SideNav.HeaderLogo>
            <span>Logo</span>
          </SideNav.HeaderLogo>
          <SideNav.HeaderTitle>App Title</SideNav.HeaderTitle>
          <SideNav.HeaderAction>Action</SideNav.HeaderAction>
        </SideNav.Header>
        {collection.rootNode.nodes?.map((node, index) => (
          <SideNav.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <SideNav.BranchNode>
                <SideNav.BranchTrigger />
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.BranchNode>
            )}
            renderLeaf={({node}) => (
              <SideNav.LeafNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
            )}
          />
        ))}
      </SideNav.Root>,
    )

    const header = page.getByRole("tree").getByTestId("side-nav-header")
    await expect.element(header).toBeInTheDocument()
    await expect.element(page.getByText("App Title")).toBeVisible()
    await expect.element(page.getByText("Action")).toBeVisible()
  })

  test("sidebar collapse trigger toggles open state", async () => {
    const collection = createTestCollection()

    await render(
      <SideNav.Root
        collection={collection}
        defaultExpandedValue={["documents"]}
      >
        <SideNav.Header>
          <SideNav.HeaderTitle>App Title</SideNav.HeaderTitle>
          <SideNav.CollapseTrigger aria-label="Toggle sidebar" />
        </SideNav.Header>
        {collection.rootNode.nodes?.map((node, index) => (
          <SideNav.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <SideNav.BranchNode>
                <SideNav.BranchTrigger />
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.BranchNode>
            )}
            renderLeaf={({node}) => (
              <SideNav.LeafNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
            )}
          />
        ))}
      </SideNav.Root>,
    )

    const root = page.getByRole("tree")
    await expect.element(root).toHaveAttribute("data-state", "open")

    const collapseTrigger = page.getByRole("treeitem", {name: "Toggle sidebar"})
    await collapseTrigger.click()

    await expect.element(root).toHaveAttribute("data-state", "closed")

    await collapseTrigger.click()
    await expect.element(root).toHaveAttribute("data-state", "open")
  })

  test("controlled sidebar open state", async () => {
    const collection = createTestCollection()

    function ControlledSideNavOpen() {
      const [open, setOpen] = useState(true)

      return (
        <div>
          <button onClick={() => setOpen(false)} type="button">
            Close Sidebar
          </button>
          <button onClick={() => setOpen(true)} type="button">
            Open Sidebar
          </button>
          <SideNav.Root
            collection={collection}
            onOpenChange={setOpen}
            open={open}
          >
            <SideNav.Header>
              <SideNav.HeaderTitle>App Title</SideNav.HeaderTitle>
            </SideNav.Header>
            {collection.rootNode.nodes?.map((node, index) => (
              <SideNav.Nodes
                key={node.id}
                indexPath={[index]}
                node={node}
                renderBranch={({node}) => (
                  <SideNav.BranchNode>
                    <SideNav.BranchTrigger />
                    <SideNav.NodeText>{node.text}</SideNav.NodeText>
                  </SideNav.BranchNode>
                )}
                renderLeaf={({node}) => (
                  <SideNav.LeafNode>
                    <SideNav.NodeText>{node.text}</SideNav.NodeText>
                  </SideNav.LeafNode>
                )}
              />
            ))}
          </SideNav.Root>
        </div>
      )
    }

    await render(<ControlledSideNavOpen />)

    const root = page.getByRole("tree")
    await expect.element(root).toHaveAttribute("data-state", "open")

    await page.getByRole("button", {name: "Close Sidebar"}).click()
    await expect.element(root).toHaveAttribute("data-state", "closed")

    await page.getByRole("button", {name: "Open Sidebar"}).click()
    await expect.element(root).toHaveAttribute("data-state", "open")
  })

  test("nested branch expansion", async () => {
    const collection = createTestCollection()

    await render(
      <SideNav.Root collection={collection}>
        {collection.rootNode.nodes?.map((node, index) => (
          <SideNav.Nodes
            key={node.id}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <SideNav.BranchNode>
                <SideNav.BranchTrigger />
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.BranchNode>
            )}
            renderLeaf={({node}) => (
              <SideNav.LeafNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
            )}
          />
        ))}
      </SideNav.Root>,
    )

    await expect.element(page.getByText("Report 1")).not.toBeVisible()

    await page.getByText("Documents").click()
    await expect.element(page.getByText("Reports")).toBeVisible()
    await expect.element(page.getByText("Report 1")).not.toBeVisible()

    await page.getByText("Reports").click()
    await expect.element(page.getByText("Report 1")).toBeVisible()
  })
})
