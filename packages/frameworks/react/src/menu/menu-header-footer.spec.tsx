import {useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {Button, type ButtonProps} from "@qualcomm-ui/react/button"
import {Dialog} from "@qualcomm-ui/react/dialog"
import {Menu} from "@qualcomm-ui/react/menu"
import {Popover} from "@qualcomm-ui/react/popover"

function HeaderFooterMenu({
  buttonProps,
  closeOnApply = false,
  disabled = false,
  onApply = () => {},
  onClear = () => {},
  onSelect = () => {},
  onSubmit = () => {},
  portal = true,
  size = "md",
}: {
  buttonProps?: Pick<ButtonProps, "density" | "size" | "variant">
  closeOnApply?: boolean
  disabled?: boolean
  onApply?: () => void
  onClear?: () => void
  onSelect?: (value: string) => void
  onSubmit?: () => void
  portal?: boolean
  size?: "sm" | "md"
}) {
  const [open, setOpen] = useState(false)
  const positioner = (
    <Menu.Positioner style={{maxHeight: 240, width: 280}}>
      <Menu.Header render={<section />}>
        <Menu.HeaderLabel>Options</Menu.HeaderLabel>
        <Button
          {...buttonProps}
          disabled={disabled}
          emphasis="primary"
          form="menu-button-form"
          onClick={onClear}
          render={<button />}
          type="button"
        >
          Clear all
        </Button>
      </Menu.Header>
      <Menu.Content>
        <Menu.ItemGroup>
          {Array.from({length: 20}, (_, index) => (
            <Menu.Item
              key={index}
              closeOnSelect={false}
              value={`option-${index + 1}`}
            >
              Option {index + 1}
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      </Menu.Content>
      <Menu.Footer render={<section />}>
        <Button
          {...buttonProps}
          form="menu-button-form"
          onClick={() => {
            onApply()
            if (closeOnApply) {
              setOpen(false)
            }
          }}
          type="button"
        >
          Apply
        </Button>
      </Menu.Footer>
    </Menu.Positioner>
  )
  return (
    <form
      id="menu-button-form"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <Menu.Root
        onOpenChange={setOpen}
        onSelect={onSelect}
        open={open}
        size={size}
      >
        <Menu.Trigger>
          <Menu.Button type="button">Choose options</Menu.Button>
        </Menu.Trigger>
        {portal ? <Portal>{positioner}</Portal> : positioner}
      </Menu.Root>
    </form>
  )
}

describe("Menu header and footer", () => {
  test("supports native button activation without selecting a menu item or submitting", async () => {
    const onApply = vi.fn()
    const onClear = vi.fn()
    const onSelect = vi.fn()
    const onSubmit = vi.fn()
    await render(
      <HeaderFooterMenu
        onApply={onApply}
        onClear={onClear}
        onSelect={onSelect}
        onSubmit={onSubmit}
      />,
    )
    await page.getByRole("button", {name: "Choose options"}).click()
    const clear = page.getByRole("button", {name: "Clear all"})
    await clear.click()
    await expect.element(clear).toHaveFocus()
    await userEvent.keyboard("{Enter}{Space}")
    await expect.poll(() => onClear).toHaveBeenCalledTimes(3)
    await page.getByRole("button", {name: "Apply"}).click()
    await expect.poll(() => onApply).toHaveBeenCalledTimes(1)
    await expect.element(page.getByRole("menu")).toBeVisible()
    expect(onSelect).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  test("leaves closing to the consumer", async () => {
    await render(<HeaderFooterMenu closeOnApply />)
    await page.getByRole("button", {name: "Choose options"}).click()
    await page.getByRole("button", {name: "Apply"}).click()
    await expect.element(page.getByRole("menu")).not.toBeInTheDocument()
  })

  test("stacks a menu with a header like one without", async () => {
    await render(
      <>
        <HeaderFooterMenu />
        <Menu.Root open>
          <Menu.Positioner data-test-id="plain">
            <Menu.Content>
              <Menu.Item value="a">A</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </>,
    )
    await page.getByRole("button", {name: "Choose options"}).click()
    const zIndex = (el: Element) => getComputedStyle(el).zIndex
    const withHeader = page
      .getByRole("button", {name: "Clear all"})
      .element()
      .closest('[data-menu-part="positioner"]')!
    const plain = page.getByTestId("plain").element()
    await expect.poll(() => zIndex(plain)).not.toBe("auto")
    await expect
      .poll(() => Number(zIndex(withHeader)))
      .toBeGreaterThanOrEqual(Number(zIndex(plain)))
  })

  test("keeps the header and footer outside the menu role", async () => {
    await render(<HeaderFooterMenu />)
    await page.getByRole("button", {name: "Choose options"}).click()
    const menu = page.getByRole("menu").element()
    expect(
      menu.contains(page.getByRole("button", {name: "Clear all"}).element()),
    ).toBe(false)
    expect(
      menu.contains(page.getByRole("button", {name: "Apply"}).element()),
    ).toBe(false)
  })

  test("keeps the header and footer visible while revealing keyboard-highlighted items", async () => {
    await render(<HeaderFooterMenu />)
    await page.getByRole("button", {name: "Choose options"}).click()
    const menu = page.getByRole("menu")
    await expect.element(menu).toHaveFocus()
    const clear = page.getByRole("button", {name: "Clear all"})
    const apply = page.getByRole("button", {name: "Apply"})
    const positioner = menu.element().parentElement!
    const top = (el: Element) =>
      el.getBoundingClientRect().top - positioner.getBoundingClientRect().top
    const clearTop = top(clear.element())
    const applyTop = top(apply.element())
    const last = page.getByRole("menuitem", {exact: true, name: "Option 20"})

    await userEvent.keyboard("{End}")
    await expect
      .element(menu)
      .toHaveAttribute("aria-activedescendant", last.element().id)
    await expect.poll(() => menu.element().scrollTop).toBeGreaterThan(0)
    await expect
      .poll(() => last.element().getBoundingClientRect().bottom)
      .toBeLessThanOrEqual(menu.element().getBoundingClientRect().bottom + 1)
    expect(top(clear.element())).toBeCloseTo(clearTop)
    expect(top(apply.element())).toBeCloseTo(applyTop)

    await userEvent.keyboard("{Home}")
    await expect.poll(() => menu.element().scrollTop).toBe(0)
  })

  test("Tab cycles through header, list and footer", async () => {
    await render(<HeaderFooterMenu />)
    await page.getByRole("button", {name: "Choose options"}).click()
    const menu = page.getByRole("menu")
    const clear = page.getByRole("button", {name: "Clear all"})
    const apply = page.getByRole("button", {name: "Apply"})
    await expect.element(menu).toHaveFocus()
    await userEvent.keyboard("{Tab}")
    await expect.element(apply).toHaveFocus()
    await userEvent.keyboard("{Tab}")
    await expect.element(clear).toHaveFocus()
    await userEvent.keyboard("{Tab}")
    await expect.element(menu).toHaveFocus()
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
    await expect.element(clear).toHaveFocus()
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
    await expect.element(apply).toHaveFocus()
    await expect.element(menu).toBeVisible()
  })

  test("hides the item focus ring while a section button has focus", async () => {
    await render(<HeaderFooterMenu />)
    await page.getByRole("button", {name: "Choose options"}).click()
    const option = (name: string) =>
      page.getByRole("menuitem", {exact: true, name})
    await userEvent.keyboard("{ArrowDown}{ArrowDown}")
    await expect
      .element(option("Option 2"))
      .toHaveAttribute("data-focus-visible")
    await userEvent.keyboard("{Tab}")
    await expect
      .element(option("Option 2"))
      .not.toHaveAttribute("data-focus-visible")
    await userEvent.keyboard("{Tab}{Tab}")
    await expect.element(page.getByRole("menu")).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    await expect
      .element(option("Option 3"))
      .toHaveAttribute("data-focus-visible")
  })

  test("exposes disabled header actions as buttons rather than menu items", async () => {
    const onSelect = vi.fn()
    const onClear = vi.fn()
    await render(
      <HeaderFooterMenu disabled onClear={onClear} onSelect={onSelect} />,
    )
    await page.getByRole("button", {name: "Choose options"}).click()
    await expect
      .element(page.getByRole("button", {name: "Clear all"}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("menuitem", {name: "Clear all"}))
      .not.toBeInTheDocument()
    await expect
      .element(page.getByRole("menuitem", {name: "Apply"}))
      .not.toBeInTheDocument()
    expect(onClear).not.toHaveBeenCalled()
  })

  test.each([
    {footerSize: "md", size: "sm"},
    {footerSize: "lg", size: "md"},
  ] as const)(
    "supplies the $size menu's button props through custom section roots",
    async ({footerSize, size}) => {
      await render(<HeaderFooterMenu size={size} />)
      await page.getByRole("button", {name: "Choose options"}).click()
      const clear = page.getByRole("button", {name: "Clear all"})
      const apply = page.getByRole("button", {name: "Apply"})
      await expect.element(clear).toHaveAttribute("data-size", size)
      await expect.element(clear).toHaveAttribute("data-density", "compact")
      await expect.element(clear).toHaveAttribute("data-variant", "ghost")
      await expect.element(apply).toHaveAttribute("data-size", footerSize)
      await expect.element(apply).toHaveAttribute("data-density", "compact")
      await expect.element(apply).toHaveAttribute("data-variant", "fill")
    },
  )

  test("lets explicit button props override the section defaults", async () => {
    await render(
      <HeaderFooterMenu
        buttonProps={{density: "default", size: "sm", variant: "outline"}}
      />,
    )
    await page.getByRole("button", {name: "Choose options"}).click()
    for (const name of ["Clear all", "Apply"]) {
      const button = page.getByRole("button", {name})
      await expect.element(button).toHaveAttribute("data-size", "sm")
      await expect.element(button).toHaveAttribute("data-density", "default")
      await expect.element(button).toHaveAttribute("data-variant", "outline")
    }
  })
})

test("cycles Tab through the sections inside a dialog's focus trap", async () => {
  await render(
    <Dialog.Root defaultOpen>
      <Portal>
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Body>
              <Dialog.Heading>Dialog</Dialog.Heading>
              <HeaderFooterMenu portal={false} />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>,
  )
  await page.getByRole("button", {name: "Choose options"}).click()
  const menu = page.getByRole("menu")
  await expect.element(menu).toHaveFocus()
  for (const name of ["Apply", "Clear all"]) {
    await userEvent.keyboard("{Tab}")
    await expect.element(page.getByRole("button", {name})).toHaveFocus()
  }
  await userEvent.keyboard("{Tab}")
  await expect.element(menu).toHaveFocus()
  await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
  await expect
    .element(page.getByRole("button", {name: "Clear all"}))
    .toHaveFocus()
})

test("keeps Tab on the list of a menu without a header or footer", async () => {
  await render(
    <>
      <Menu.Root>
        <Menu.Trigger>
          <Menu.Button>Plain</Menu.Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="a">A</Menu.Item>
              <Menu.Item value="b">B</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      <button type="button">After</button>
    </>,
  )
  await page.getByRole("button", {name: "Plain"}).click()
  const menu = page.getByRole("menu")
  await expect.element(menu).toHaveFocus()
  await userEvent.keyboard("{Tab}")
  await expect.element(menu).toHaveFocus()
  await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
  await expect.element(menu).toHaveFocus()
})

test("moves into a portalled submenu from a menu with a footer", async () => {
  await render(
    <Menu.Root>
      <Menu.Trigger>
        <Menu.Button>Parent</Menu.Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Root>
              <Menu.TriggerItem value="more">More</Menu.TriggerItem>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="child">Child</Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Menu.Content>
          <Menu.Footer>
            <Button>Apply</Button>
          </Menu.Footer>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>,
  )
  await page.getByRole("button", {name: "Parent"}).click()
  await userEvent.keyboard("{ArrowDown}{ArrowRight}")
  const submenu = page.getByRole("menu").nth(1)
  await expect.element(submenu).toHaveFocus()
  await userEvent.keyboard("{Tab}")
  await expect.element(submenu).toHaveFocus()
  await userEvent.keyboard("{ArrowLeft}")
  await expect.element(page.getByRole("menu").first()).toHaveFocus()
  await expect.element(submenu).not.toBeInTheDocument()
  await userEvent.keyboard("{Tab}")
  await expect.element(page.getByRole("button", {name: "Apply"})).toHaveFocus()
})

test("returns focus to the parent list from a submenu rendered without a portal", async () => {
  await render(
    <Menu.Root>
      <Menu.Trigger>
        <Menu.Button>Parent</Menu.Button>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Root>
            <Menu.TriggerItem value="more">More</Menu.TriggerItem>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="child">Child</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
          <Menu.Item value="next">Next</Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>,
  )
  await page.getByRole("button", {name: "Parent"}).click()
  await userEvent.keyboard("{ArrowDown}{ArrowRight}")
  await expect.element(page.getByRole("menu").nth(1)).toHaveFocus()
  await userEvent.keyboard("{ArrowLeft}")
  const parent = page.getByRole("menu").first()
  await expect.element(parent).toHaveFocus()
  await userEvent.keyboard("{ArrowDown}")
  await expect
    .element(parent)
    .toHaveAttribute(
      "aria-activedescendant",
      page.getByRole("menuitem", {name: "Next"}).element().id,
    )
})

test("focuses an autofocus element inside the content on open", async () => {
  await render(
    <Menu.Root>
      <Menu.Trigger>
        <Menu.Button>Search</Menu.Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <input aria-label="Filter" data-autofocus />
            <Menu.Item value="a">A</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>,
  )
  await page.getByRole("button", {name: "Search"}).click()
  const input = page.getByRole("textbox", {name: "Filter"})
  await expect.element(input).toHaveFocus()
  await page.getByRole("menuitem", {name: "A"}).hover()
  await expect.element(input).toHaveFocus()
})

test("opens another menu while one with a footer is already open", async () => {
  const menu = (label: string, footer: boolean) => (
    <Menu.Root>
      <Menu.Trigger>
        <Menu.Button>{label}</Menu.Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="x">{`${label} item`}</Menu.Item>
          </Menu.Content>
          {footer ? (
            <Menu.Footer>
              <Button>Apply</Button>
            </Menu.Footer>
          ) : null}
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
  await render(
    <div style={{display: "flex", gap: 400}}>
      {menu("First", true)}
      {menu("Second", false)}
    </div>,
  )
  await page.getByRole("button", {name: "First"}).click()
  await expect.element(page.getByRole("button", {name: "Apply"})).toBeVisible()
  await page.getByRole("button", {name: "Second"}).click()
  await expect
    .element(page.getByRole("button", {name: "Second"}))
    .toHaveAttribute("aria-expanded", "true")
})

test("keeps Tab wrapping inside a dialog rendered within an open menu", async () => {
  await render(
    <Menu.Root defaultOpen>
      <Menu.Trigger>
        <Menu.Button>Actions</Menu.Button>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Item value="rename">Rename</Menu.Item>
        </Menu.Content>
        <Menu.Footer>
          <Dialog.Root defaultOpen>
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Body>
                  <Dialog.Heading>Rename</Dialog.Heading>
                  <button type="button">First</button>
                  <button type="button">Last</button>
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
        </Menu.Footer>
      </Menu.Positioner>
    </Menu.Root>,
  )
  const first = page.getByRole("button", {name: "First"})
  const last = page.getByRole("button", {name: "Last"})
  await last.click()
  await expect.element(last).toHaveFocus()
  await userEvent.keyboard("{Tab}")
  await expect.element(first).toHaveFocus()
  await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
  await expect.element(last).toHaveFocus()
})

test("keeps a dialog's Tab wrapping when no menu is open", async () => {
  await render(
    <Dialog.Root defaultOpen>
      <Portal>
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Body>
              <Dialog.Heading>Dialog</Dialog.Heading>
              <button type="button">First</button>
              <HeaderFooterMenu portal={false} />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>,
  )
  const first = page.getByRole("button", {name: "First"})
  const trigger = page.getByRole("button", {name: "Choose options"})
  await first.click()
  await userEvent.keyboard("{Tab}")
  await expect.element(trigger).toHaveFocus()
  await userEvent.keyboard("{Tab}")
  await expect.element(first).toHaveFocus()
})

test("does not carry a parent footer's button props into a nested menu", async () => {
  await render(
    <Menu.Root open>
      <Menu.Positioner>
        <Menu.Content />
        <Menu.Footer>
          <Button>Outer apply</Button>
          <Menu.Root open size="sm">
            <Portal>
              <Menu.Positioner>
                <Menu.Header>
                  <Button>Inner clear</Button>
                </Menu.Header>
                <Menu.Content />
                <Button>Inner ordinary</Button>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Menu.Footer>
      </Menu.Positioner>
    </Menu.Root>,
  )
  await expect
    .element(page.getByRole("button", {name: "Outer apply"}))
    .toHaveAttribute("data-size", "lg")
  const clear = page.getByRole("button", {name: "Inner clear"})
  await expect.element(clear).toHaveAttribute("data-size", "sm")
  await expect.element(clear).toHaveAttribute("data-variant", "ghost")
  const ordinary = page.getByRole("button", {name: "Inner ordinary"})
  await expect.element(ordinary).toHaveAttribute("data-size", "md")
  await expect.element(ordinary).toHaveAttribute("data-density", "default")
})

test("keeps a containing popover open while using the header and footer", async () => {
  const onApply = vi.fn()
  await render(
    <Popover.Root>
      <Popover.Trigger>
        <button type="button">Open settings</button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Label>Settings</Popover.Label>
            <HeaderFooterMenu onApply={onApply} />
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>,
  )
  await page.getByRole("button", {name: "Open settings"}).click()
  const popover = page.getByRole("dialog", {name: "Settings"})
  await expect.element(popover).toBeVisible()
  await page.getByRole("button", {name: "Choose options"}).click()
  const menu = page.getByRole("menu")
  await expect.element(menu).toHaveFocus()

  const clear = page.getByRole("button", {name: "Clear all"})
  await clear.click()
  await expect.element(clear).toHaveFocus()
  await expect.element(menu).toBeVisible()
  await expect.element(popover).toBeVisible()

  await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
  await expect.element(page.getByRole("button", {name: "Apply"})).toHaveFocus()
  await expect.element(menu).toBeVisible()
  await expect.element(popover).toBeVisible()

  await page.getByRole("button", {name: "Apply"}).click()
  await expect.poll(() => onApply).toHaveBeenCalledTimes(1)
  await expect.element(popover).toBeVisible()
})
