import {Plus, Search} from "lucide-react"
import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {
  Button,
  ButtonGroup,
  ButtonPropsContextProvider,
  IconButton,
} from "@qualcomm-ui/react/button"

const startIconTestId = "button-start-icon"
const endIconTestId = "button-end-icon"
const iconButtonIconTestId = "icon-button-icon"

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

describe("Contextual button props", () => {
  test("supplies overridable props to text and icon buttons outside a menu", async () => {
    await render(
      <ButtonPropsContextProvider
        value={{
          density: "compact",
          disabled: true,
          emphasis: "danger",
          size: "sm",
          variant: "ghost",
        }}
      >
        <Button>Inherited text</Button>
        <IconButton aria-label="Inherited icon" icon={Plus} />
        <Button
          density="default"
          disabled={false}
          emphasis="primary"
          size="lg"
          variant="outline"
        >
          Overridden text
        </Button>
        <IconButton
          aria-label="Overridden icon"
          density="default"
          disabled={false}
          emphasis="primary"
          icon={Plus}
          size="lg"
          variant="outline"
        />
      </ButtonPropsContextProvider>,
    )
    for (const name of ["Inherited text", "Inherited icon"]) {
      const button = page.getByRole("button", {name})
      await expect.element(button).toBeDisabled()
      await expect.element(button).toHaveAttribute("data-size", "sm")
      await expect.element(button).toHaveAttribute("data-density", "compact")
      await expect.element(button).toHaveAttribute("data-variant", "ghost")
      await expect.element(button).toHaveAttribute("data-emphasis", "danger")
    }
    for (const name of ["Overridden text", "Overridden icon"]) {
      const button = page.getByRole("button", {name})
      await expect.element(button).not.toBeDisabled()
      await expect.element(button).toHaveAttribute("data-size", "lg")
      await expect.element(button).toHaveAttribute("data-density", "default")
      await expect.element(button).toHaveAttribute("data-variant", "outline")
      await expect.element(button).toHaveAttribute("data-emphasis", "primary")
    }
  })

  test("preserves the button group's enforced size, density and disabled state", async () => {
    await render(
      <ButtonPropsContextProvider
        value={{density: "default", disabled: false, size: "sm"}}
      >
        <ButtonGroup density="compact" disabled size="lg">
          <Button>Grouped text</Button>
          <IconButton aria-label="Grouped icon" icon={Plus} />
        </ButtonGroup>
      </ButtonPropsContextProvider>,
    )
    for (const name of ["Grouped text", "Grouped icon"]) {
      const button = page.getByRole("button", {name})
      await expect.element(button).toBeDisabled()
      await expect.element(button).toHaveAttribute("data-size", "lg")
      await expect.element(button).toHaveAttribute("data-density", "compact")
    }
  })

  test("lets the button group's emphasis and variant win over the defaults", async () => {
    await render(
      <ButtonPropsContextProvider
        value={{emphasis: "danger", variant: "ghost"}}
      >
        <ButtonGroup emphasis="primary" variant="outline">
          <Button>Group styled text</Button>
          <IconButton aria-label="Group styled icon" icon={Plus} />
          <Button emphasis="neutral" variant="fill">
            Own styled text
          </Button>
        </ButtonGroup>
      </ButtonPropsContextProvider>,
    )
    for (const name of ["Group styled text", "Group styled icon"]) {
      const button = page.getByRole("button", {name})
      await expect.element(button).toHaveAttribute("data-emphasis", "primary")
      await expect.element(button).toHaveAttribute("data-variant", "outline")
    }
    const own = page.getByRole("button", {name: "Own styled text"})
    await expect.element(own).toHaveAttribute("data-emphasis", "neutral")
    await expect.element(own).toHaveAttribute("data-variant", "fill")
  })
})
