import {useState} from "react"

import {Plus, Star} from "lucide-react"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"
import {render} from "vitest-browser-react"

import {Tag} from "@qualcomm-ui/react/tag"

describe("Tag", () => {
  describe("rendering", () => {
    test("renders children text", async () => {
      await render(<Tag>Hello</Tag>)
      await expect.element(page.getByText("Hello")).toBeVisible()
    })

    test("link variant renders as button", async () => {
      await render(<Tag variant="link">Link</Tag>)
      await expect
        .element(page.getByRole("button", {name: "Link"}))
        .toBeVisible()
    })
  })

  describe("selectable variant", () => {
    test("click toggles selection", async () => {
      const onSelectedChange = vi.fn()
      await render(
        <Tag onSelectedChange={onSelectedChange} variant="selectable">
          Toggle
        </Tag>,
      )

      await page.getByRole("button", {name: "Toggle"}).click()
      await expect.poll(() => onSelectedChange).toHaveBeenCalledWith(true)

      await page.getByRole("button", {name: "Toggle"}).click()
      await expect.poll(() => onSelectedChange).toHaveBeenCalledWith(false)
    })

    test("defaultSelected starts selected", async () => {
      const onSelectedChange = vi.fn()
      await render(
        <Tag
          defaultSelected
          onSelectedChange={onSelectedChange}
          variant="selectable"
        >
          Default
        </Tag>,
      )

      await page.getByRole("button", {name: "Default"}).click()
      await expect.poll(() => onSelectedChange).toHaveBeenCalledWith(false)
    })

    test("controlled state - initially selected", async () => {
      function Component() {
        const [selected, setSelected] = useState(true)
        return (
          <Tag
            onSelectedChange={setSelected}
            selected={selected}
            variant="selectable"
          >
            Controlled
          </Tag>
        )
      }

      await render(<Component />)
      const button = page.getByRole("button", {name: "Controlled"})

      await expect.element(button).toHaveAttribute("data-selected")
      await button.click()
      await expect.element(button).not.toHaveAttribute("data-selected")
      await button.click()
      await expect.element(button).toHaveAttribute("data-selected")
    })

    test("controlled state - initially unselected", async () => {
      function Component() {
        const [selected, setSelected] = useState(false)
        return (
          <Tag
            onSelectedChange={setSelected}
            selected={selected}
            variant="selectable"
          >
            Controlled
          </Tag>
        )
      }

      await render(<Component />)
      const button = page.getByRole("button", {name: "Controlled"})

      await expect.element(button).not.toHaveAttribute("data-selected")
      await button.click()
      await expect.element(button).toHaveAttribute("data-selected")
      await button.click()
      await expect.element(button).not.toHaveAttribute("data-selected")
    })
  })

  describe("dismissable variant", () => {
    test("clicking dismiss fires onDismiss", async () => {
      const onDismiss = vi.fn()
      await render(
        <Tag onDismiss={onDismiss} variant="dismissable">
          Dismiss Me
        </Tag>,
      )

      await page.getByRole("button", {name: "Dismiss"}).click()
      await expect.poll(() => onDismiss).toHaveBeenCalled()
    })

    test("dismissed state after clicking dismiss", async () => {
      await render(
        <Tag data-test-id="tag-root" variant="dismissable">
          Dismiss Me
        </Tag>,
      )

      const root = page.getByTestId("tag-root")
      await expect.element(root).not.toHaveAttribute("data-dismissed")

      await page.getByRole("button", {name: "Dismiss"}).click()
      await expect.element(root).toHaveAttribute("data-dismissed")
    })
  })

  describe("disabled state", () => {
    test("disabled link variant", async () => {
      await render(
        <Tag disabled variant="link">
          Disabled
        </Tag>,
      )
      await expect
        .element(page.getByRole("button", {name: "Disabled"}))
        .toBeDisabled()
    })

    test("disabled prevents selection toggle", async () => {
      const onSelectedChange = vi.fn()
      await render(
        <Tag disabled onSelectedChange={onSelectedChange} variant="selectable">
          Disabled Select
        </Tag>,
      )

      await page
        .getByRole("button", {name: "Disabled Select"})
        .click({force: true})
      expect(onSelectedChange).not.toHaveBeenCalled()
    })

    test("disabled prevents dismiss", async () => {
      const onDismiss = vi.fn()
      await render(
        <Tag
          data-test-id="tag-root"
          disabled
          onDismiss={onDismiss}
          variant="dismissable"
        >
          Disabled Dismiss
        </Tag>,
      )

      await page.getByRole("button", {name: "Dismiss"}).click({force: true})
      expect(onDismiss).not.toHaveBeenCalled()

      await expect
        .element(page.getByTestId("tag-root"))
        .not.toHaveAttribute("data-dismissed")
    })
  })

  describe("icons", () => {
    test("startIcon renders", async () => {
      await render(
        <Tag startIcon={Plus} variant="selectable">
          With Start Icon
        </Tag>,
      )

      await expect
        .element(page.getByRole("button", {name: "With Start Icon"}))
        .toBeVisible()
      await expect.element(page.getByTestId("qui-icon").first()).toBeVisible()
    })

    test("endIcon renders on non-dismissable", async () => {
      await render(
        <Tag endIcon={Star} variant="selectable">
          With End Icon
        </Tag>,
      )

      await expect
        .element(page.getByRole("button", {name: "With End Icon"}))
        .toBeVisible()
      await expect.element(page.getByTestId("qui-icon").first()).toBeVisible()
    })

    test("endIcon is ignored for dismissable variant", async () => {
      await render(
        <Tag endIcon={Star} variant="dismissable">
          Dismiss Only
        </Tag>,
      )

      await expect
        .element(page.getByRole("button", {name: "Dismiss"}))
        .toBeVisible()

      const icons = page.getByTestId("qui-icon")
      await expect.element(icons.first()).toBeVisible()
      expect(icons.all()).toHaveLength(1)
    })
  })
})
