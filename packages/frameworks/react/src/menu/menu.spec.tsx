import {useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"
import {render} from "vitest-browser-react"

import {Menu} from "@qualcomm-ui/react/menu"
import {Portal} from "@qualcomm-ui/react-core/portal"

const testIds = {
  checkboxItem: "checkbox-item",
  content: "menu-content",
  nestedContent: "nested-content",
  nestedTrigger: "nested-trigger",
  radioItem: "radio-item",
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
            <Menu.Content data-test-id={testIds.content}>
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
                <Menu.CheckboxItem
                  data-test-id={testIds.checkboxItem}
                  value="option-1"
                >
                  <Menu.CheckboxItemControl />
                  <Menu.ItemLabel>Option 1</Menu.ItemLabel>
                </Menu.CheckboxItem>
                <Menu.CheckboxItem value="option-2">
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

    const checkboxItem = page.getByTestId(testIds.checkboxItem)
    await expect
      .element(checkboxItem)
      .not.toHaveAttribute("data-state", "checked")
    await checkboxItem.click()
    await expect.element(checkboxItem).toHaveAttribute("data-state", "checked")
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
                <Menu.RadioItem data-test-id={testIds.radioItem} value="one">
                  <Menu.RadioItemControl />
                  <Menu.ItemLabel>Option 1</Menu.ItemLabel>
                </Menu.RadioItem>
                <Menu.RadioItem value="two">
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

    const radioItem = page.getByTestId(testIds.radioItem)
    await expect.element(radioItem).not.toHaveAttribute("data-state", "checked")
    await radioItem.click()
    await expect.element(radioItem).toHaveAttribute("data-state", "checked")
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
                <Menu.TriggerItem
                  data-test-id={testIds.nestedTrigger}
                  value="nested"
                >
                  Open Recent
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content data-test-id={testIds.nestedContent}>
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

    await page.getByTestId(testIds.nestedTrigger).hover()
    await expect.element(page.getByTestId(testIds.nestedContent)).toBeVisible()

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
    await render(
      <Menu.Root>
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
    await expect
      .element(page.getByText("Item 1"))
      .toHaveAttribute("data-highlighted")

    await userEvent.keyboard("{ArrowDown}")
    await expect
      .element(page.getByText("Item 2"))
      .toHaveAttribute("data-highlighted")

    await userEvent.keyboard("{Escape}")
    await expect.element(page.getByRole("menu")).not.toBeInTheDocument()
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
})
