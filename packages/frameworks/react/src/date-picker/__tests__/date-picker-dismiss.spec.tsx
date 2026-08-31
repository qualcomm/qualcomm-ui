import type {ReactNode} from "react"

import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {DatePicker, parseDate} from "@qualcomm-ui/react/date-picker"

const seeded = parseDate("2024-06-15")

const grid = () => page.getByRole("grid")
const trigger = () =>
  page.getByRole("button", {name: /(?:choose|change) date/i})
const openCalendar = () => trigger().click()

/**
 * `trackDismissableElement` distinguishes focusable from non-focusable outside
 * targets, so both are needed to cover the focus-restore branch. They sit above
 * the picker because the popover opens downwards and would otherwise cover them.
 */
function Outside({children}: {children: ReactNode}) {
  return (
    <>
      <button>Focusable outside</button>
      <div style={{height: 40, width: 200}}>Plain outside</div>
      {children}
    </>
  )
}

describe("DatePicker - Dismiss", () => {
  test("clicking outside closes the calendar and keeps the committed value", async () => {
    await render(
      <Outside>
        <DatePicker
          defaultValue={[parseDate("2024-06-10")]}
          label="Departure date"
        />
      </Outside>,
    )
    await openCalendar()
    await expect.element(grid()).toBeVisible()

    await page.getByRole("button", {name: "Focusable outside"}).click()

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(page.getByRole("textbox")).toHaveValue("06/10/2024")
  })

  test("clicking outside discards a pending selection when closeOnSelect is false", async () => {
    await render(
      <Outside>
        <DatePicker
          closeOnSelect={false}
          defaultFocusedValue={seeded}
          defaultValue={[parseDate("2024-06-10")]}
          label="Departure date"
        />
      </Outside>,
    )
    await openCalendar()

    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
    await expect.element(page.getByRole("textbox")).toHaveValue("06/20/2024")

    await page.getByRole("button", {name: "Focusable outside"}).click()

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(page.getByRole("textbox")).toHaveValue("06/10/2024")
  })

  test("dismissing onto a non-focusable target returns focus to the trigger", async () => {
    await render(
      <Outside>
        <DatePicker defaultFocusedValue={seeded} label="Departure date" />
      </Outside>,
    )
    await openCalendar()

    await page.getByText("Plain outside").click()

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(trigger()).toHaveFocus()
  })

  test("a focusable dismiss keeps focus even after an earlier non-focusable one", async () => {
    await render(
      <Outside>
        <DatePicker defaultFocusedValue={seeded} label="Departure date" />
      </Outside>,
    )
    const outsideButton = page.getByRole("button", {name: "Focusable outside"})

    await openCalendar()
    await page.getByText("Plain outside").click()
    await expect.element(trigger()).toHaveFocus()

    await openCalendar()
    await outsideButton.click()

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(outsideButton).toHaveFocus()
  })

  test("dismissing onto a focusable target leaves focus where the user put it", async () => {
    await render(
      <Outside>
        <DatePicker defaultFocusedValue={seeded} label="Departure date" />
      </Outside>,
    )
    await openCalendar()

    const outsideButton = page.getByRole("button", {name: "Focusable outside"})
    await outsideButton.click()

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(outsideButton).toHaveFocus()
  })

  test("clicking the input does not count as an outside interaction", async () => {
    await render(
      <Outside>
        <DatePicker defaultFocusedValue={seeded} label="Departure date" />
      </Outside>,
    )
    await openCalendar()

    await page.getByRole("textbox").click()

    await expect.element(grid()).toBeVisible()
  })

  test("clicking inside the calendar does not close it", async () => {
    await render(
      <Outside>
        <DatePicker
          closeOnSelect={false}
          defaultFocusedValue={seeded}
          label="Departure date"
        />
      </Outside>,
    )
    await openCalendar()

    await page.getByRole("button", {name: /switch to next month/i}).click()

    await expect.element(grid()).toBeVisible()
  })

  test("the inline variant ignores outside interaction entirely", async () => {
    await render(
      <Outside>
        <DatePicker
          defaultFocusedValue={seeded}
          label="Departure date"
          variant="inline"
        />
      </Outside>,
    )
    await expect.element(grid()).toBeVisible()

    await page.getByRole("button", {name: "Focusable outside"}).click()

    await expect.element(grid()).toBeVisible()
  })
})
