import {useState} from "react"

import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"
import {render} from "vitest-browser-react"

import {DatePicker} from "@qualcomm-ui/react/date-picker"

const demoLabel = "Select Date"
const demoPlaceholder = "MM/DD/YYYY"
const demoHint = "Choose your preferred date"
const demoErrorText = "Date is required"

describe("DatePicker", () => {
  test("renders with label and input", async () => {
    await render(
      <DatePicker label={demoLabel} placeholder={demoPlaceholder} />,
    )

    await expect.element(page.getByText(demoLabel)).toBeVisible()
    await expect.element(page.getByPlaceholderText(demoPlaceholder)).toBeVisible()
  })

  test("label click focuses input", async () => {
    await render(
      <DatePicker label={demoLabel} placeholder={demoPlaceholder} />,
    )

    await page.getByText(demoLabel).click()
    await expect.element(page.getByLabelText(demoLabel)).toHaveFocus()
  })

  test("opens calendar on trigger click", async () => {
    await render(
      <DatePicker label={demoLabel} placeholder={demoPlaceholder} />,
    )

    const trigger = page.getByRole("button", {name: "Toggle calendar"})
    await expect.element(trigger).toBeVisible()
    await trigger.click()

    const calendar = page.getByRole("grid")
    await expect.element(calendar).toBeVisible()
  })

  test("closes calendar on escape key", async () => {
    await render(
      <DatePicker label={demoLabel} placeholder={demoPlaceholder} />,
    )

    const trigger = page.getByRole("button", {name: "Toggle calendar"})
    await trigger.click()

    const dialog = page.getByRole("dialog")
    await expect.element(dialog).toBeVisible()

    await page.keyboard.press("Escape")
    await expect.element(dialog).not.toBeVisible()
  })

  test("displays hint text", async () => {
    await render(
      <DatePicker
        hint={demoHint}
        label={demoLabel}
        placeholder={demoPlaceholder}
      />,
    )

    await expect.element(page.getByText(demoHint)).toBeVisible()
  })

  test("displays error text when invalid", async () => {
    await render(
      <DatePicker
        errorText={demoErrorText}
        invalid
        label={demoLabel}
        placeholder={demoPlaceholder}
      />,
    )

    await expect.element(page.getByText(demoErrorText)).toBeVisible()
  })

  test("controlled value updates", async () => {
    function ControlledDatePicker() {
      const [value, setValue] = useState<Date | null>(null)

      return (
        <div>
          <DatePicker
            label={demoLabel}
            placeholder={demoPlaceholder}
            value={value}
            onValueChange={(details) => setValue(details.value)}
          />
          {value && <div data-testid="selected-value">{value.toISOString()}</div>}
        </div>
      )
    }

    await render(<ControlledDatePicker />)

    const trigger = page.getByRole("button", {name: "Toggle calendar"})
    await trigger.click()

    const todayButton = page.getByRole("button", {name: "Go to today"})
    await todayButton.click()

    await expect.element(page.getByTestId("selected-value")).toBeVisible()
  })

  test("clear button clears value", async () => {
    function ControlledDatePicker() {
      const [value, setValue] = useState<Date | null>(new Date())

      return (
        <div>
          <DatePicker
            label={demoLabel}
            placeholder={demoPlaceholder}
            value={value}
            onValueChange={(details) => setValue(details.value)}
          />
          {value && <div data-testid="has-value">Has value</div>}
        </div>
      )
    }

    await render(<ControlledDatePicker />)

    await expect.element(page.getByTestId("has-value")).toBeVisible()

    const clearButton = page.getByRole("button", {name: "Clear value"})
    await clearButton.click()

    await expect.element(page.getByTestId("has-value")).not.toBeInTheDocument()
  })

  test("disabled state prevents interaction", async () => {
    await render(
      <DatePicker
        disabled
        label={demoLabel}
        placeholder={demoPlaceholder}
      />,
    )

    const input = page.getByLabelText(demoLabel)
    await expect.element(input).toBeDisabled()

    const trigger = page.getByRole("button", {name: "Toggle calendar"})
    await expect.element(trigger).toBeDisabled()
  })

  test("respects size variants", async () => {
    const {rerender} = await render(
      <DatePicker label={demoLabel} size="sm" />,
    )

    let root = page.getByTestId("date-picker-root") || page.getByLabelText(demoLabel).closest("[data-size]")
    if (root) {
      await expect.element(root).toHaveAttribute("data-size", "sm")
    }

    await rerender(<DatePicker label={demoLabel} size="lg" />)

    root = page.getByTestId("date-picker-root") || page.getByLabelText(demoLabel).closest("[data-size]")
    if (root) {
      await expect.element(root).toHaveAttribute("data-size", "lg")
    }
  })
})
