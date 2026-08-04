import {useState} from "react"

import {Plus, Star} from "lucide-react"
import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {Tag} from "@qualcomm-ui/react/tag"

const startIconTestId = "tag-start-icon"
const endIconTestId = "tag-end-icon"

describe("Tag", () => {
  test("renders its children as the tag label", async () => {
    await render(<Tag>Label</Tag>)

    await expect.element(page.getByText("Label")).toBeVisible()
  })

  test("does not render any icon when startIcon and endIcon are omitted", async () => {
    await render(<Tag>Label</Tag>)

    await expect.element(page.getByText("Label")).toBeVisible()
    await expect
      .element(page.getByTestId(startIconTestId))
      .not.toBeInTheDocument()
    await expect
      .element(page.getByTestId(endIconTestId))
      .not.toBeInTheDocument()
  })

  test("renders startIcon visible alongside the label", async () => {
    await render(
      <Tag startIcon={<Plus data-test-id={startIconTestId} />}>Label</Tag>,
    )

    const icon = page.getByTestId(startIconTestId)
    const label = page.getByText("Label")

    await expect.element(icon).toBeVisible()
    await expect.element(label).toBeVisible()
  })

  test("renders endIcon visible alongside the label", async () => {
    await render(
      <Tag endIcon={<Star data-test-id={endIconTestId} />}>Label</Tag>,
    )

    const icon = page.getByTestId(endIconTestId)
    const label = page.getByText("Label")

    await expect.element(icon).toBeVisible()
    await expect.element(label).toBeVisible()
  })

  test("ignores endIcon when variant is dismissable and renders a Dismiss button", async () => {
    await render(
      <Tag
        endIcon={<Star data-test-id={endIconTestId} />}
        variant="dismissable"
      >
        Label
      </Tag>,
    )

    await expect
      .element(page.getByRole("button", {name: "Dismiss"}))
      .toBeVisible()
    await expect
      .element(page.getByTestId(endIconTestId))
      .not.toBeInTheDocument()
  })

  test("fires onDismiss when the Dismiss button is clicked on a dismissable tag", async () => {
    const onDismiss = vi.fn()
    await render(
      <Tag onDismiss={onDismiss} variant="dismissable">
        Label
      </Tag>,
    )

    await page.getByRole("button", {name: "Dismiss"}).click()

    await expect.poll(() => onDismiss.mock.calls.length).toBe(1)
  })

  test("exposes a selectable tag as a button with an accessible name", async () => {
    await render(<Tag variant="selectable">Label</Tag>)

    await expect
      .element(page.getByRole("button", {name: "Label"}))
      .toBeVisible()
  })

  test("does not expose a default tag as a button", async () => {
    await render(<Tag>Label</Tag>)

    await expect.element(page.getByText("Label")).toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "Label"}))
      .not.toBeInTheDocument()
  })

  test("composes user onClick with the internal handler on a selectable tag", async () => {
    const onClick = vi.fn()
    await render(
      <Tag onClick={onClick} variant="selectable">
        Label
      </Tag>,
    )

    await page.getByRole("button", {name: "Label"}).click()

    await expect.poll(() => onClick.mock.calls.length).toBe(1)
  })

  test("disables a selectable tag from receiving clicks when disabled", async () => {
    const onClick = vi.fn()
    await render(
      <Tag disabled onClick={onClick} variant="selectable">
        Label
      </Tag>,
    )

    const tag = page.getByRole("button", {name: "Label"})
    await expect.element(tag).toHaveAttribute("aria-disabled", "true")
    await expect.element(tag).toHaveAttribute("tabindex", "-1")

    await tag.click({force: true}).catch(() => {
      // pointer-events are disabled via CSS; swallow so the assertion runs
    })

    expect(onClick).not.toHaveBeenCalled()
  })

  test("exposes the selectable tag's pressed state to assistive tech and toggles it when uncontrolled", async () => {
    await render(<Tag variant="selectable">Label</Tag>)

    const tag = page.getByRole("button", {name: "Label"})
    await expect.element(tag).toHaveAttribute("aria-pressed", "false")

    await tag.click()
    await expect.element(tag).toHaveAttribute("aria-pressed", "true")

    await tag.click()
    await expect.element(tag).toHaveAttribute("aria-pressed", "false")
  })

  test("starts pressed when defaultSelected is true and toggles from there", async () => {
    await render(
      <Tag defaultSelected variant="selectable">
        Label
      </Tag>,
    )

    const tag = page.getByRole("button", {name: "Label"})
    await expect.element(tag).toHaveAttribute("aria-pressed", "true")

    await tag.click()
    await expect.element(tag).toHaveAttribute("aria-pressed", "false")
  })

  test("fires onSelectedChange with the next value on each toggle when uncontrolled", async () => {
    const onSelectedChange = vi.fn()
    await render(
      <Tag onSelectedChange={onSelectedChange} variant="selectable">
        Label
      </Tag>,
    )

    const tag = page.getByRole("button", {name: "Label"})
    await tag.click()
    await tag.click()

    await expect
      .poll(() => onSelectedChange.mock.calls)
      .toEqual([[true], [false]])
  })

  test("does not toggle internal state when controlled, but fires onSelectedChange", async () => {
    const onSelectedChange = vi.fn()
    await render(
      <Tag
        onSelectedChange={onSelectedChange}
        selected={false}
        variant="selectable"
      >
        Label
      </Tag>,
    )

    const tag = page.getByRole("button", {name: "Label"})
    await tag.click()

    expect(onSelectedChange).toHaveBeenCalledWith(true)
    await expect.element(tag).toHaveAttribute("aria-pressed", "false")
  })

  test("reflects parent-driven changes to selected when controlled", async () => {
    function ControlledTag() {
      const [selected, setSelected] = useState(false)
      return (
        <Tag
          onSelectedChange={setSelected}
          selected={selected}
          variant="selectable"
        >
          Label
        </Tag>
      )
    }

    await render(<ControlledTag />)

    const tag = page.getByRole("button", {name: "Label"})
    await expect.element(tag).toHaveAttribute("aria-pressed", "false")

    await tag.click()
    await expect.element(tag).toHaveAttribute("aria-pressed", "true")

    await tag.click()
    await expect.element(tag).toHaveAttribute("aria-pressed", "false")
  })

  test("does not expose pressed state on non-selectable variants", async () => {
    await render(
      <Tag selected variant="link">
        Label
      </Tag>,
    )

    await expect
      .element(page.getByRole("button", {name: "Label"}))
      .not.toHaveAttribute("aria-pressed")
  })

  test("disables the Dismiss button on a disabled dismissable tag", async () => {
    const onDismiss = vi.fn()
    await render(
      <Tag disabled onDismiss={onDismiss} variant="dismissable">
        Label
      </Tag>,
    )

    const dismissButton = page.getByRole("button", {name: "Dismiss"})
    await expect.element(dismissButton).toBeDisabled()

    await dismissButton.click({force: true}).catch(() => {
      // disabled buttons reject pointer events; swallow so the assertion runs
    })

    expect(onDismiss).not.toHaveBeenCalled()
  })

  test("exposes a tag rendered as an anchor as a link with an accessible name", async () => {
    await render(<Tag render={<a href="/blog/ai" />}>Label</Tag>)

    await expect.element(page.getByRole("link", {name: "Label"})).toBeVisible()
  })

  test("does not expose an anchor tag as a button", async () => {
    await render(<Tag render={<a href="/blog/ai" />}>Label</Tag>)

    await expect.element(page.getByRole("link", {name: "Label"})).toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "Label"}))
      .not.toBeInTheDocument()
  })

  test("does not expose pressed state on an anchor tag", async () => {
    await render(<Tag render={<a href="/blog/ai" />}>Label</Tag>)

    await expect
      .element(page.getByRole("link", {name: "Label"}))
      .not.toHaveAttribute("aria-pressed")
  })

  test("marks a disabled anchor tag inert via aria-disabled and tabindex without an invalid disabled attribute", async () => {
    await render(
      <Tag disabled render={<a href="/blog/ai" />}>
        Label
      </Tag>,
    )

    const link = page.getByRole("link", {name: "Label"})
    await expect.element(link).toHaveAttribute("aria-disabled", "true")
    await expect.element(link).toHaveAttribute("tabindex", "-1")
    await expect.element(link).not.toHaveAttribute("disabled")
  })

  test("does not set aria-disabled or tabindex on an enabled anchor tag", async () => {
    await render(<Tag render={<a href="/blog/ai" />}>Label</Tag>)

    const link = page.getByRole("link", {name: "Label"})
    await expect.element(link).not.toHaveAttribute("aria-disabled")
    await expect.element(link).not.toHaveAttribute("tabindex")
  })
})
