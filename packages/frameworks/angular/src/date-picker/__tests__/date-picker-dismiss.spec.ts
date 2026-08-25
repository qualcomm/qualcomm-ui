import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {DatePickerModule, parseDate} from "@qualcomm-ui/angular/date-picker"

const seeded = parseDate("2024-06-15")

/**
 * The outside targets sit above the picker: the popover opens downwards and would
 * otherwise cover them, timing out the click.
 */
function withOutsideTemplate(rootAttrs = "") {
  return `
    <button type="button">Focusable outside</button>
    <div style="height: 40px; width: 200px">Plain outside</div>
    <q-date-picker label="Departure date" ${rootAttrs} />
  `
}

function withOutside(rootAttrs?: string) {
  @Component({
    imports: [DatePickerModule],
    template: withOutsideTemplate(rootAttrs),
  })
  class OutsideComponent {
    protected readonly june10 = [parseDate("2024-06-10")]
    protected readonly seeded = seeded
  }
  return OutsideComponent
}

const grid = () => page.getByRole("grid")
const trigger = () =>
  page.getByRole("button", {name: /(?:choose|change) date/i})
const openCalendar = () => trigger().click()
const outsideButton = () =>
  page.getByRole("button", {name: "Focusable outside"})

describe("DatePicker - Dismiss", () => {
  test("clicking outside closes the calendar and keeps the committed value", async () => {
    await render(withOutside(`[defaultValue]="june10"`))
    await openCalendar()
    await expect.element(grid()).toBeVisible()

    await outsideButton().click()

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(page.getByRole("textbox")).toHaveValue("06/10/2024")
  })

  test("clicking outside discards a pending selection when closeOnSelect is false", async () => {
    await render(
      withOutside(`
        [closeOnSelect]="false"
        [defaultFocusedValue]="seeded"
        [defaultValue]="june10"
      `),
    )
    await openCalendar()

    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()
    await expect.element(page.getByRole("textbox")).toHaveValue("06/20/2024")

    await outsideButton().click()

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(page.getByRole("textbox")).toHaveValue("06/10/2024")
  })

  test("dismissing onto a non-focusable target returns focus to the trigger", async () => {
    await render(withOutside(`[defaultFocusedValue]="seeded"`))
    await openCalendar()

    await page.getByText("Plain outside").click()

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(trigger()).toHaveFocus()
  })

  test("a focusable dismiss keeps focus even after an earlier non-focusable one", async () => {
    await render(withOutside(`[defaultFocusedValue]="seeded"`))

    await openCalendar()
    await page.getByText("Plain outside").click()
    await expect.element(trigger()).toHaveFocus()

    await openCalendar()
    await outsideButton().click()

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(outsideButton()).toHaveFocus()
  })

  test("dismissing onto a focusable target leaves focus where the user put it", async () => {
    await render(withOutside(`[defaultFocusedValue]="seeded"`))
    await openCalendar()

    await outsideButton().click()

    await expect.element(grid()).not.toBeInTheDocument()
    await expect.element(outsideButton()).toHaveFocus()
  })

  test("clicking the input does not count as an outside interaction", async () => {
    await render(withOutside(`[defaultFocusedValue]="seeded"`))
    await openCalendar()

    await page.getByRole("textbox").click()

    await expect.element(grid()).toBeVisible()
  })

  test("clicking inside the calendar does not close it", async () => {
    await render(
      withOutside(`[closeOnSelect]="false" [defaultFocusedValue]="seeded"`),
    )
    await openCalendar()

    await page.getByRole("button", {name: /switch to next month/i}).click()

    await expect.element(grid()).toBeVisible()
  })

  test("the inline variant ignores outside interaction entirely", async () => {
    await render(withOutside(`variant="inline" [defaultFocusedValue]="seeded"`))
    await expect.element(grid()).toBeVisible()

    await outsideButton().click()

    await expect.element(grid()).toBeVisible()
  })
})
