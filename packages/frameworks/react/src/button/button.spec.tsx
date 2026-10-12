import type {ComponentProps} from "react"

import {Plus, Search} from "lucide-react"
import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {NumberBadge, StatusBadge} from "@qualcomm-ui/react/badge"
import {Button, ButtonGroup, IconButton} from "@qualcomm-ui/react/button"
import {Menu} from "@qualcomm-ui/react/menu"

const startIconTestId = "button-start-icon"
const endIconTestId = "button-end-icon"
const iconButtonIconTestId = "icon-button-icon"
const badgeTestId = "button-badge"

describe("Button", () => {
  test("renders children and fires onClick when clicked", async () => {
    const onClick = vi.fn()
    await render(<Button onClick={onClick}>Click Me</Button>)

    const button = page.getByRole("button", {name: "Click Me"})
    await expect.element(button).toBeVisible()

    await button.click()

    await expect.poll(() => onClick.mock.calls.length).toBe(1)
  })

  test("does not fire onClick when disabled", async () => {
    const onClick = vi.fn()
    await render(
      <Button disabled onClick={onClick}>
        Click Me
      </Button>,
    )

    const button = page.getByRole("button", {name: "Click Me"})
    await expect.element(button).toBeDisabled()

    await button.click({force: true}).catch(() => {
      // disabled buttons reject pointer events; swallow so the assertion runs
    })

    expect(onClick).not.toHaveBeenCalled()
  })

  test("renders a visible startIcon alongside the children", async () => {
    await render(
      <Button startIcon={<Plus data-test-id={startIconTestId} />}>
        Add Item
      </Button>,
    )

    const icon = page.getByTestId(startIconTestId)
    await expect.element(icon).toBeVisible()

    await expect
      .element(page.getByRole("button", {name: "Add Item"}))
      .toBeVisible()
  })

  test("renders a visible endIcon alongside the children", async () => {
    await render(
      <Button endIcon={<Plus data-test-id={endIconTestId} />}>Add Item</Button>,
    )

    const icon = page.getByTestId(endIconTestId)
    await expect.element(icon).toBeVisible()

    await expect
      .element(page.getByRole("button", {name: "Add Item"}))
      .toBeVisible()
  })

  test("exposes the aria-label as the accessible name", async () => {
    await render(<Button aria-label="Save document">Save</Button>)

    await expect
      .element(page.getByRole("button", {name: "Save document"}))
      .toBeVisible()
  })
})

describe("IconButton", () => {
  test("renders an accessible button when icon is a LucideIcon component", async () => {
    await render(<IconButton aria-label="Add" icon={Plus} />)

    await expect.element(page.getByRole("button", {name: "Add"})).toBeVisible()
  })

  test("renders a user-supplied ReactElement icon visibly inside the button", async () => {
    await render(
      <IconButton
        aria-label="Search"
        icon={<Search data-test-id={iconButtonIconTestId} />}
      />,
    )

    await expect
      .element(page.getByRole("button", {name: "Search"}))
      .toBeVisible()
    await expect.element(page.getByTestId(iconButtonIconTestId)).toBeVisible()
  })

  test("does not fire onClick when disabled", async () => {
    const onClick = vi.fn()
    await render(
      <IconButton aria-label="Add" disabled icon={Plus} onClick={onClick} />,
    )

    const button = page.getByRole("button", {name: "Add"})
    await expect.element(button).toBeDisabled()

    await button.click({force: true}).catch(() => {
      // disabled buttons reject pointer events; swallow so the assertion runs
    })

    expect(onClick).not.toHaveBeenCalled()
  })
})

describe("ButtonGroup", () => {
  test("exposes children through a group with an accessible name", async () => {
    await render(
      <ButtonGroup aria-label="Editor actions">
        <Button>Save</Button>
        <Button>Cancel</Button>
      </ButtonGroup>,
    )

    await expect
      .element(page.getByRole("group", {name: "Editor actions"}))
      .toBeVisible()
    await expect.element(page.getByRole("button", {name: "Save"})).toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "Cancel"}))
      .toBeVisible()
  })

  test("propagates disabled to child Buttons", async () => {
    await render(
      <ButtonGroup aria-label="Editor actions" disabled>
        <Button>Save</Button>
        <Button>Cancel</Button>
      </ButtonGroup>,
    )

    await expect
      .element(page.getByRole("button", {name: "Save"}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("button", {name: "Cancel"}))
      .toBeDisabled()
  })

  test("propagates disabled to child IconButtons", async () => {
    await render(
      <ButtonGroup aria-label="Toolbar" disabled>
        <IconButton aria-label="Add" icon={Plus} />
      </ButtonGroup>,
    )

    await expect.element(page.getByRole("button", {name: "Add"})).toBeDisabled()
  })

  test("group density and size win over the child's own values", async () => {
    await render(
      <ButtonGroup aria-label="Editor actions" density="compact" size="lg">
        <Button density="default" size="sm">
          Save
        </Button>
      </ButtonGroup>,
    )

    const button = page.getByRole("button", {name: "Save"})
    await expect.element(button).toHaveAttribute("data-density", "compact")
    await expect.element(button).toHaveAttribute("data-size", "lg")
  })

  test("child emphasis and variant override the group's values", async () => {
    await render(
      <ButtonGroup
        aria-label="Editor actions"
        emphasis="primary"
        variant="outline"
      >
        <Button emphasis="neutral" variant="fill">
          Save
        </Button>
      </ButtonGroup>,
    )

    const button = page.getByRole("button", {name: "Save"})
    await expect.element(button).toHaveAttribute("data-emphasis", "neutral")
    await expect.element(button).toHaveAttribute("data-variant", "fill")
  })
})

describe("Button badge", () => {
  test("renders badge content after the children and includes it in the button's accessible name", async () => {
    await render(<Button badge={<NumberBadge value={3} />}>Inbox</Button>)

    await expect
      .element(page.getByRole("button", {name: "Inbox 3"}))
      .toBeVisible()
  })

  test("number badge defaults to the fill emphasis table and the mapped size for a default button", async () => {
    await render(
      <Button badge={<NumberBadge data-test-id={badgeTestId} value={1} />}>
        Notifications
      </Button>,
    )

    const badge = page.getByTestId(badgeTestId)
    await expect.element(badge).toHaveAttribute("data-size", "xs")
    await expect
      .element(badge)
      .toHaveAttribute("data-emphasis", "persistent-white")
  })

  test("number badge defaults to the outline emphasis table for an outline button", async () => {
    await render(
      <Button
        badge={<NumberBadge data-test-id={badgeTestId} value={1} />}
        emphasis="primary"
        variant="outline"
      >
        Notifications
      </Button>,
    )

    await expect
      .element(page.getByTestId(badgeTestId))
      .toHaveAttribute("data-emphasis", "brand")
  })

  test("number badge size follows a large button", async () => {
    await render(
      <Button
        badge={<NumberBadge data-test-id={badgeTestId} value={1} />}
        size="lg"
      >
        Notifications
      </Button>,
    )

    await expect
      .element(page.getByTestId(badgeTestId))
      .toHaveAttribute("data-size", "sm")
  })

  test("status badge size follows the button's mapped size", async () => {
    await render(
      <Button badge={<StatusBadge data-test-id={badgeTestId} />} size="lg">
        Status
      </Button>,
    )

    await expect
      .element(page.getByTestId(badgeTestId))
      .toHaveAttribute("data-size", "md")
  })

  test("status badge keeps its own default emphasis regardless of the button's variant", async () => {
    await render(
      <Button
        badge={<StatusBadge data-test-id={badgeTestId} />}
        emphasis="primary"
        variant="fill"
      >
        Status
      </Button>,
    )

    await expect
      .element(page.getByTestId(badgeTestId))
      .toHaveAttribute("data-emphasis", "neutral")
  })

  test("disabling the button disables its badge", async () => {
    await render(
      <Button
        badge={<NumberBadge data-test-id={badgeTestId} value={1} />}
        disabled
      >
        Notifications
      </Button>,
    )

    await expect
      .element(page.getByTestId(badgeTestId))
      .toHaveAttribute("data-disabled", "")
  })

  test("badge's own size and emphasis win over the button's defaults", async () => {
    await render(
      <Button
        badge={
          <NumberBadge
            data-test-id={badgeTestId}
            emphasis="danger"
            size="md"
            value={1}
          />
        }
        size="lg"
        variant="fill"
      >
        Notifications
      </Button>,
    )

    const badge = page.getByTestId(badgeTestId)
    await expect.element(badge).toHaveAttribute("data-size", "md")
    await expect.element(badge).toHaveAttribute("data-emphasis", "danger")
  })

  test("a badge rendered by a custom root element receives the button's defaults", async () => {
    function CustomButton({children, ...props}: ComponentProps<"button">) {
      return (
        <button {...props}>
          {children}
          <NumberBadge data-test-id={badgeTestId} value={1} />
        </button>
      )
    }

    await render(
      <Button render={<CustomButton />} size="lg">
        Notifications
      </Button>,
    )

    await expect
      .element(page.getByTestId(badgeTestId))
      .toHaveAttribute("data-size", "sm")
  })

  test("a standalone number badge outside a button keeps its own defaults", async () => {
    await render(<NumberBadge data-test-id={badgeTestId} value={1} />)

    const badge = page.getByTestId(badgeTestId)
    await expect.element(badge).toHaveAttribute("data-size", "md")
    await expect.element(badge).toHaveAttribute("data-emphasis", "neutral")
    await expect.element(badge).not.toHaveAttribute("data-disabled")
  })

  test("Menu.Button renders badge content and includes it in the trigger's accessible name", async () => {
    await render(
      <Menu.Root>
        <Menu.Trigger>
          <Menu.Button badge={<NumberBadge value={2} />}>Actions</Menu.Button>
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
      .element(page.getByRole("button", {name: "Actions 2"}))
      .toBeVisible()
  })
})
