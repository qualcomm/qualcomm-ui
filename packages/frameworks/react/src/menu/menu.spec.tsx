import {useState} from "react"

import {Ellipsis} from "lucide-react"
import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {MenuContext as CoreMenuContext} from "@qualcomm-ui/react-core/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {Menu} from "@qualcomm-ui/react/menu"

async function expectLastCallWith(
  spy: ReturnType<typeof vi.fn>,
  value: unknown,
) {
  const calls = spy.mock.calls as unknown[][]
  await expect.poll(() => calls[calls.length - 1]?.[0]).toBe(value)
}

describe("Menu", () => {
  test("Opens and closes", async () => {
    await render(
      <Menu.Root>
        <Menu.Trigger>
          <Menu.Button>Menu</Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="option-1">Option 1</Menu.Item>
              <Menu.Item value="option-2">Option 2</Menu.Item>
              <Menu.Item value="option-3">Option 3</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )

    await expect.element(page.getByRole("menu")).not.toBeInTheDocument()
    await page.getByText("Menu").click()
    await expect.element(page.getByRole("menu")).toBeVisible()

    await userEvent.keyboard("{Escape}")
    await expect.element(page.getByRole("menu")).not.toBeInTheDocument()
  })

  test("Controlled state", async () => {
    function ControlledMenu() {
      const [open, setOpen] = useState(false)
      return (
        <Menu.Root onOpenChange={setOpen} open={open}>
          <Menu.Trigger>
            <Menu.Button>Controlled Menu</Menu.Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="item-1">Item 1</Menu.Item>
                <Menu.Item value="item-2">Item 2</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      )
    }

    await render(<ControlledMenu />)

    await expect.element(page.getByRole("menu")).not.toBeInTheDocument()
    await page.getByText("Controlled Menu").click()
    await expect.element(page.getByRole("menu")).toBeVisible()
    await page.getByText("Item 1").click()
    await expect.element(page.getByRole("menu")).not.toBeInTheDocument()
  })

  test("Context render prop exposes live menu state", async () => {
    await render(
      <Menu.Root>
        <Menu.Trigger>
          <Menu.Button>Context Menu</Menu.Button>
        </Menu.Trigger>
        <CoreMenuContext>
          {(context) => (
            <div data-test-id="menu-context-state">
              {context.open ? "open" : "closed"}
            </div>
          )}
        </CoreMenuContext>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="duplicate">Duplicate</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )

    const contextState = page.getByTestId("menu-context-state")
    await expect.element(contextState).toHaveTextContent("closed")

    await page.getByRole("button", {name: "Context Menu"}).click()
    await expect.element(contextState).toHaveTextContent("open")

    await userEvent.keyboard("{Escape}")
    await expect.element(contextState).toHaveTextContent("closed")
  })

  test("Checkbox items", async () => {
    await render(
      <Menu.Root>
        <Menu.Trigger>
          <Menu.Button>Checkbox Menu</Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.ItemGroup>
                <Menu.ItemGroupLabel>Options</Menu.ItemGroupLabel>
                <Menu.CheckboxItem closeOnSelect={false} value="option-1">
                  <Menu.CheckboxItemControl />
                  <Menu.ItemLabel>Option 1</Menu.ItemLabel>
                </Menu.CheckboxItem>
                <Menu.CheckboxItem closeOnSelect={false} value="option-2">
                  <Menu.CheckboxItemControl />
                  <Menu.ItemLabel>Option 2</Menu.ItemLabel>
                </Menu.CheckboxItem>
              </Menu.ItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )

    await page.getByText("Checkbox Menu").click()
    await expect.element(page.getByRole("menu")).toBeVisible()

    const checkboxItem = page.getByRole("menuitemcheckbox", {name: "Option 1"})
    await expect.element(checkboxItem).toHaveAttribute("aria-checked", "false")
    await checkboxItem.click()
    await expect.element(checkboxItem).toHaveAttribute("aria-checked", "true")
  })

  test("Radio group", async () => {
    await render(
      <Menu.Root>
        <Menu.Trigger>
          <Menu.Button>Radio Menu</Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.RadioItemGroup>
                <Menu.ItemGroupLabel>Choose one</Menu.ItemGroupLabel>
                <Menu.RadioItem closeOnSelect={false} value="one">
                  <Menu.RadioItemControl />
                  <Menu.ItemLabel>Option 1</Menu.ItemLabel>
                </Menu.RadioItem>
                <Menu.RadioItem closeOnSelect={false} value="two">
                  <Menu.RadioItemControl />
                  <Menu.ItemLabel>Option 2</Menu.ItemLabel>
                </Menu.RadioItem>
              </Menu.RadioItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )

    await page.getByText("Radio Menu").click()
    await expect.element(page.getByRole("menu")).toBeVisible()

    const radioItem = page.getByRole("menuitemradio", {name: "Option 1"})
    await expect.element(radioItem).toHaveAttribute("aria-checked", "false")
    await radioItem.click()
    await expect.element(radioItem).toHaveAttribute("aria-checked", "true")
  })

  test("Nested menu", async () => {
    await render(
      <Menu.Root>
        <Menu.Trigger>
          <Menu.Button>Parent Menu</Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="item-1">Item 1</Menu.Item>
              <Menu.Root>
                <Menu.TriggerItem value="nested">Open Recent</Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item value="file-1">File 1</Menu.Item>
                      <Menu.Item value="file-2">File 2</Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )

    await page.getByText("Parent Menu").click()
    await expect.element(page.getByRole("menu")).toBeVisible()

    await page.getByRole("menuitem", {name: /Open Recent/}).hover()
    await expect.element(page.getByText("File 1")).toBeVisible()

    await page.getByText("File 1").click()
    await expect.element(page.getByRole("menu")).not.toBeInTheDocument()
  })

  test("Menu item selection", async () => {
    const onSelectSpy = vi.fn()

    function SelectableMenu() {
      return (
        <Menu.Root onSelect={onSelectSpy}>
          <Menu.Trigger>
            <Menu.Button>Selectable Menu</Menu.Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="action-1">Action 1</Menu.Item>
                <Menu.Item value="action-2">Action 2</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      )
    }

    await render(<SelectableMenu />)

    await page.getByText("Selectable Menu").click()
    await page.getByText("Action 1").click()

    await vi.waitFor(() => {
      expect(onSelectSpy).toHaveBeenCalledWith("action-1")
    })
  })

  test("Keyboard navigation", async () => {
    const onHighlightChangeSpy = vi.fn()

    await render(
      <Menu.Root onHighlightChange={onHighlightChangeSpy}>
        <Menu.Trigger>
          <Menu.Button>Keyboard Menu</Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="item-1">Item 1</Menu.Item>
              <Menu.Item value="item-2">Item 2</Menu.Item>
              <Menu.Item value="item-3">Item 3</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )

    await page.getByText("Keyboard Menu").click()
    await expect.element(page.getByRole("menu")).toBeVisible()

    await userEvent.keyboard("{ArrowDown}")
    await expectLastCallWith(onHighlightChangeSpy, "item-1")

    await userEvent.keyboard("{ArrowDown}")
    await expectLastCallWith(onHighlightChangeSpy, "item-2")

    await userEvent.keyboard("{Escape}")
    await expect.element(page.getByRole("menu")).not.toBeInTheDocument()
  })

  test("opens from trigger keyboard shortcuts and selects the highlighted item", async () => {
    const onOpenChangeSpy = vi.fn()
    const onSelectSpy = vi.fn()

    await render(
      <Menu.Root onOpenChange={onOpenChangeSpy} onSelect={onSelectSpy}>
        <Menu.Trigger>
          <Menu.Button>Shortcut Menu</Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="new-file">New File</Menu.Item>
              <Menu.Item value="open-file">Open File</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )

    await userEvent.tab()
    await expect
      .element(page.getByRole("button", {name: "Shortcut Menu"}))
      .toHaveFocus()
    await userEvent.keyboard("{Enter}")

    await expect.element(page.getByRole("menu")).toBeVisible()
    await expectLastCallWith(onOpenChangeSpy, true)

    await userEvent.keyboard("{Enter}")
    await expect.poll(() => onSelectSpy).toHaveBeenCalledWith("new-file")
    await expect.element(page.getByRole("menu")).not.toBeInTheDocument()
    await expectLastCallWith(onOpenChangeSpy, false)
  })

  test("supports Home, End, typeahead, and looping keyboard navigation", async () => {
    const onHighlightChangeSpy = vi.fn()
    const onSelectSpy = vi.fn()

    await render(
      <Menu.Root
        loopFocus
        onHighlightChange={onHighlightChangeSpy}
        onSelect={onSelectSpy}
      >
        <Menu.Trigger>
          <Menu.Button>Navigate Menu</Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="alpha">Alpha</Menu.Item>
              <Menu.Item value="bravo">Bravo</Menu.Item>
              <Menu.Item value="delta">Delta</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )

    await page.getByRole("button", {name: "Navigate Menu"}).click()
    await expect.element(page.getByRole("menu")).toBeVisible()

    await userEvent.keyboard("{End}")
    await expectLastCallWith(onHighlightChangeSpy, "delta")

    await userEvent.keyboard("{Home}")
    await expectLastCallWith(onHighlightChangeSpy, "alpha")

    await userEvent.keyboard("d")
    await expectLastCallWith(onHighlightChangeSpy, "delta")

    await userEvent.keyboard("{ArrowDown}")
    await expectLastCallWith(onHighlightChangeSpy, "alpha")

    await userEvent.keyboard("{ArrowUp}")
    await expectLastCallWith(onHighlightChangeSpy, "delta")

    await userEvent.keyboard("{Enter}")
    await expect.poll(() => onSelectSpy).toHaveBeenCalledWith("delta")
    await expect.element(page.getByRole("menu")).not.toBeInTheDocument()
  })

  test("does not select disabled items and skips them during keyboard navigation", async () => {
    const onSelectSpy = vi.fn()
    const onDisabledSelectSpy = vi.fn()
    const onHighlightChangeSpy = vi.fn()

    await render(
      <Menu.Root
        onHighlightChange={onHighlightChangeSpy}
        onSelect={onSelectSpy}
      >
        <Menu.Trigger>
          <Menu.Button>Disabled Menu</Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item
                disabled
                onSelect={onDisabledSelectSpy}
                value="archive"
              >
                Archive
              </Menu.Item>
              <Menu.Item value="rename">Rename</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )

    await page.getByRole("button", {name: "Disabled Menu"}).click()

    const disabledItem = page.getByRole("menuitem", {name: "Archive"})
    await expect.element(disabledItem).toHaveAttribute("aria-disabled", "true")

    await disabledItem.click({force: true})
    expect(onSelectSpy).not.toHaveBeenCalled()
    expect(onDisabledSelectSpy).not.toHaveBeenCalled()
    await expect.element(page.getByRole("menu")).toBeVisible()

    await userEvent.keyboard("{ArrowDown}")
    await expectLastCallWith(onHighlightChangeSpy, "rename")

    await userEvent.keyboard("{Enter}")
    await expect.poll(() => onSelectSpy).toHaveBeenCalledWith("rename")
  })

  test("keeps the menu open when checkbox items opt out of close on select", async () => {
    const onCheckedChangeSpy = vi.fn()

    function ControlledCheckboxMenu() {
      const [checked, setChecked] = useState(false)

      return (
        <Menu.Root>
          <Menu.Trigger>
            <Menu.Button>Checkbox State Menu</Menu.Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.CheckboxItem
                  checked={checked}
                  closeOnSelect={false}
                  onCheckedChange={(nextChecked) => {
                    onCheckedChangeSpy(nextChecked)
                    setChecked(nextChecked)
                  }}
                  value="line-numbers"
                >
                  <Menu.ItemLabel>Line numbers</Menu.ItemLabel>
                  <Menu.ItemIndicator />
                </Menu.CheckboxItem>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      )
    }

    await render(<ControlledCheckboxMenu />)

    await page.getByRole("button", {name: "Checkbox State Menu"}).click()

    const checkboxItem = page.getByRole("menuitemcheckbox", {
      name: "Line numbers",
    })
    await expect.element(checkboxItem).toHaveAttribute("aria-checked", "false")

    await checkboxItem.click()
    await expect.poll(() => onCheckedChangeSpy).toHaveBeenCalledWith(true)
    await expect.element(page.getByRole("menu")).toBeVisible()
    await expect.element(checkboxItem).toHaveAttribute("aria-checked", "true")

    await checkboxItem.click()
    await expect.poll(() => onCheckedChangeSpy).toHaveBeenCalledWith(false)
    await expect.element(checkboxItem).toHaveAttribute("aria-checked", "false")
  })

  test("updates controlled radio group value without closing when requested", async () => {
    const onValueChangeSpy = vi.fn()

    function ControlledRadioMenu() {
      const [value, setValue] = useState("comfortable")

      return (
        <Menu.Root>
          <Menu.Trigger>
            <Menu.Button>Density Menu</Menu.Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.RadioItemGroup
                  onValueChange={(nextValue) => {
                    onValueChangeSpy(nextValue)
                    setValue(nextValue)
                  }}
                  value={value}
                >
                  <Menu.RadioItem closeOnSelect={false} value="compact">
                    <Menu.ItemLabel>Compact</Menu.ItemLabel>
                  </Menu.RadioItem>
                  <Menu.RadioItem closeOnSelect={false} value="comfortable">
                    <Menu.ItemLabel>Comfortable</Menu.ItemLabel>
                  </Menu.RadioItem>
                </Menu.RadioItemGroup>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      )
    }

    await render(<ControlledRadioMenu />)

    await page.getByRole("button", {name: "Density Menu"}).click()

    const compactItem = page.getByRole("menuitemradio", {name: "Compact"})
    const comfortableItem = page.getByRole("menuitemradio", {
      name: "Comfortable",
    })
    await expect
      .element(comfortableItem)
      .toHaveAttribute("aria-checked", "true")
    await expect.element(compactItem).toHaveAttribute("aria-checked", "false")

    await compactItem.click()
    await expect.poll(() => onValueChangeSpy).toHaveBeenCalledWith("compact")
    await expect.element(page.getByRole("menu")).toBeVisible()
    await expect.element(compactItem).toHaveAttribute("aria-checked", "true")
    await expect
      .element(comfortableItem)
      .toHaveAttribute("aria-checked", "false")
  })

  test("opens a submenu with arrow keys and selects the highlighted child item", async () => {
    const onSelectSpy = vi.fn()

    await render(
      <Menu.Root>
        <Menu.Trigger>
          <Menu.Button>Keyboard Parent Menu</Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="new-file">New File</Menu.Item>
              <Menu.Root onSelect={onSelectSpy}>
                <Menu.TriggerItem value="open-recent">
                  Open Recent
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item value="file-1">File 1</Menu.Item>
                      <Menu.Item value="file-2">File 2</Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )

    await page.getByRole("button", {name: "Keyboard Parent Menu"}).click()
    await userEvent.keyboard("{ArrowDown}")
    await userEvent.keyboard("{ArrowDown}")
    await userEvent.keyboard("{ArrowRight}")

    await expect.element(page.getByText("File 1")).toBeVisible()
    await expect
      .element(page.getByRole("menu", {name: /Open Recent/}))
      .toHaveFocus()

    await userEvent.keyboard("{Enter}")
    await expect.poll(() => onSelectSpy).toHaveBeenCalledWith("file-1")
    await expect.element(page.getByRole("menu")).not.toBeInTheDocument()
  })

  test("uses the navigate callback when keyboard selection targets a link item", async () => {
    const navigateSpy = vi.fn()

    await render(
      <Menu.Root navigate={navigateSpy}>
        <Menu.Trigger>
          <Menu.Button>Link Menu</Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item
                render={
                  <a
                    href="/projects"
                    onClick={(event) => event.preventDefault()}
                  >
                    Projects
                  </a>
                }
                value="projects"
              />
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )

    await page.getByRole("button", {name: "Link Menu"}).click()
    await userEvent.keyboard("{ArrowDown}")
    await userEvent.keyboard("{Enter}")

    await expect
      .poll(() => navigateSpy)
      .toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining("/projects"),
          value: "projects",
        }),
      )
  })

  test("Menu with separators", async () => {
    await render(
      <Menu.Root>
        <Menu.Trigger>
          <Menu.Button>Menu with Separators</Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="new">New</Menu.Item>
              <Menu.Item value="open">Open</Menu.Item>
              <Menu.Separator />
              <Menu.Item value="save">Save</Menu.Item>
              <Menu.Item value="export">Export</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )

    await page.getByText("Menu with Separators").click()
    await expect.element(page.getByRole("menu")).toBeVisible()
    await expect.element(page.getByRole("separator")).toBeVisible()
  })

  test("IconButton trigger opens the menu by accessible name", async () => {
    await render(
      <div>
        <Menu.Root>
          <Menu.Trigger>
            <Menu.IconButton aria-label="More actions" icon={Ellipsis} />
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="rename">Rename</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>

        <Menu.Root>
          <Menu.Trigger>
            <Menu.IconButton aria-label="Filter actions" />
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="filter-by-owner">Filter by owner</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </div>,
    )

    const moreActionsTrigger = page.getByRole("button", {
      name: "More actions",
    })
    await expect
      .element(moreActionsTrigger)
      .toHaveAttribute("aria-expanded", "false")
    await moreActionsTrigger.click()
    await expect.element(page.getByRole("menu")).toBeVisible()
    await expect.element(page.getByText("Rename")).toBeVisible()
    await expect
      .element(moreActionsTrigger)
      .toHaveAttribute("aria-expanded", "true")

    await userEvent.keyboard("{Escape}")
    await expect.element(page.getByRole("menu")).not.toBeInTheDocument()

    await page.getByRole("button", {name: "Filter actions"}).click()
    await expect.element(page.getByRole("menu")).toBeVisible()
    await expect.element(page.getByText("Filter by owner")).toBeVisible()
  })

  test("ContextTrigger opens the menu from a context menu interaction", async () => {
    await render(
      <Menu.Root>
        <Menu.ContextTrigger>Right click here</Menu.ContextTrigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="new-text-file">New Text File</Menu.Item>
              <Menu.Item value="export">Export</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )

    await expect.element(page.getByRole("menu")).not.toBeInTheDocument()
    await page.getByRole("button", {name: "Right click here"}).click({
      button: "right",
    })

    const menu = page.getByRole("menu")
    await expect.element(menu).toBeVisible()
    await expect.element(page.getByText("New Text File")).toBeVisible()
  })

  test("renders item start icon, command, description, and accessory content", async () => {
    await render(
      <Menu.Root size="sm">
        <Menu.Trigger>
          <Menu.Button>Open actions</Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="open-project">
                <Menu.ItemStartIcon icon={<span>TXT</span>} />
                <Menu.ItemLabel>Open Project</Menu.ItemLabel>
                <Menu.ItemDescription>Recently opened</Menu.ItemDescription>
                <Menu.ItemAccessory>Synced</Menu.ItemAccessory>
                <Menu.ItemCommand>Ctrl+O</Menu.ItemCommand>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )

    await page.getByRole("button", {name: "Open actions"}).click()

    await expect
      .element(page.getByRole("menuitem", {name: /Open Project/}))
      .toBeVisible()
    await expect.element(page.getByText("TXT")).toBeVisible()
    await expect.element(page.getByText("Synced")).toBeVisible()
    await expect.element(page.getByText("Recently opened")).toBeVisible()
    await expect.element(page.getByText("Ctrl+O")).toBeVisible()
  })

  test("Menu.Button trigger inherits the menu size", async () => {
    await render(
      <Menu.Root size="sm">
        <Menu.Trigger>
          <Menu.Button>Sized Menu</Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="option-1">Option 1</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )

    await expect
      .element(page.getByRole("button", {name: "Sized Menu"}))
      .toHaveAttribute("data-size", "sm")
  })

  test("Menu.IconButton trigger inherits the menu size", async () => {
    await render(
      <Menu.Root size="sm">
        <Menu.Trigger>
          <Menu.IconButton aria-label="More actions" icon={Ellipsis} />
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="rename">Rename</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )

    await expect
      .element(page.getByRole("button", {name: "More actions"}))
      .toHaveAttribute("data-size", "sm")
  })

  test("an explicit trigger size overrides the inherited menu size", async () => {
    await render(
      <Menu.Root size="sm">
        <Menu.Trigger>
          <Menu.Button size="lg">Override Menu</Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="option-1">Option 1</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )

    await expect
      .element(page.getByRole("button", {name: "Override Menu"}))
      .toHaveAttribute("data-size", "lg")
  })
})

describe("Menu.SplitButton", () => {
  function renderSplitButton(
    props: Partial<Parameters<typeof Menu.SplitButton>[0]> = {},
  ) {
    return render(
      <Menu.Root>
        <Menu.SplitButton {...props}>Save</Menu.SplitButton>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="save-as">Save as</Menu.Item>
              <Menu.Item value="save-copy">Save a copy</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>,
    )
  }

  test("clicking the action button fires onClick without opening the menu", async () => {
    const onClick = vi.fn()
    await renderSplitButton({onClick})

    await page.getByRole("button", {name: "Save"}).click()

    await expect.poll(() => onClick.mock.calls.length).toBe(1)
    await expect.element(page.getByRole("menu")).not.toBeInTheDocument()
  })

  test("clicking the chevron trigger opens the menu", async () => {
    const onClick = vi.fn()
    await renderSplitButton({onClick})

    await expect.element(page.getByRole("menu")).not.toBeInTheDocument()

    await page.getByRole("button", {name: "More options"}).click()

    await expect.element(page.getByRole("menu")).toBeVisible()
    await expect.element(page.getByText("Save as")).toBeVisible()
    expect(onClick).not.toHaveBeenCalled()
  })

  test("the chevron trigger has a default accessible name of More options", async () => {
    await renderSplitButton()

    await expect
      .element(page.getByRole("button", {name: "More options"}))
      .toBeVisible()
  })

  test("triggerProps aria-label overrides the chevron accessible name", async () => {
    await renderSplitButton({triggerProps: {"aria-label": "Custom name"}})

    await expect
      .element(page.getByRole("button", {name: "Custom name"}))
      .toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "More options"}))
      .not.toBeInTheDocument()
  })

  test("shared props cascade to both the action and chevron buttons", async () => {
    await renderSplitButton({emphasis: "primary"})

    await expect
      .element(page.getByRole("button", {name: "Save"}))
      .toHaveAttribute("data-emphasis", "primary")
    await expect
      .element(page.getByRole("button", {name: "More options"}))
      .toHaveAttribute("data-emphasis", "primary")
  })
})
