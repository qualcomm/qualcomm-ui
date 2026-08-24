import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {
  DatePicker,
  type DatePickerProps,
  type DatePickerRootProps,
  parseDate,
} from "@qualcomm-ui/react/date-picker"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const seeded = parseDate("2024-06-15")

const trailingLabel = "After the picker"

function Composite(props: Partial<DatePickerRootProps>) {
  return (
    <>
      <DatePicker.Root defaultFocusedValue={seeded} {...props}>
        <DatePicker.Control>
          <DatePicker.InputGroup label="Departure date" />
        </DatePicker.Control>
        <Portal>
          <DatePicker.Positioner>
            <DatePicker.Content>
              <DatePicker.View view="day">
                <DatePicker.ViewControl>
                  <DatePicker.ViewTrigger view="month">
                    <DatePicker.MonthText />
                  </DatePicker.ViewTrigger>
                  <DatePicker.ViewTrigger view="year">
                    <DatePicker.YearText />
                  </DatePicker.ViewTrigger>
                  <DatePicker.PrevTrigger />
                  <DatePicker.NextTrigger />
                </DatePicker.ViewControl>
                <DatePicker.Table>
                  <DatePicker.DayGridHeader />
                  <DatePicker.DayGrid />
                </DatePicker.Table>
              </DatePicker.View>
            </DatePicker.Content>
          </DatePicker.Positioner>
        </Portal>
      </DatePicker.Root>
      <button type="button">{trailingLabel}</button>
    </>
  )
}

function Simple(props: Partial<DatePickerProps>) {
  return (
    <>
      <DatePicker
        defaultFocusedValue={seeded}
        label="Departure date"
        {...props}
      />
      <button type="button">{trailingLabel}</button>
    </>
  )
}

const grid = () => page.getByRole("grid")
const input = () => page.getByRole("textbox")
const trailingButton = () => page.getByRole("button", {name: trailingLabel})
const focusedCell = () =>
  page.getByRole("button", {exact: false, name: /June 15, 2024/})

const openCalendar = () =>
  page.getByRole("button", {name: /open calendar/i}).click()

const tests: MultiComponentTestCase<Partial<DatePickerRootProps>>[] = [
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("Tab from the calendar returns to the input instead of leaving the picker", async () => {
        await render(getComponent())

        await openCalendar()
        await expect.element(focusedCell()).toHaveFocus()

        await userEvent.tab()

        await expect.element(input()).toHaveFocus()
        await expect.element(grid()).toBeVisible()
        await expect.element(trailingButton()).not.toHaveFocus()
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("Shift+Tab from the input returns to the calendar instead of dismissing it", async () => {
        await render(getComponent())

        await openCalendar()
        await userEvent.tab()
        await expect.element(input()).toHaveFocus()

        await userEvent.tab({shift: true})

        await expect.element(focusedCell()).toHaveFocus()
        await expect.element(grid()).toBeVisible()
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("repeated Tab presses never reach content outside the picker", async () => {
        await render(getComponent())

        await openCalendar()

        for (let i = 0; i < 8; i++) {
          await userEvent.tab()
          await expect.element(trailingButton()).not.toHaveFocus()
        }

        await expect.element(grid()).toBeVisible()
      })
    },
  },
  {
    composite: () => <Composite openOnClick />,
    simple: () => <Simple openOnClick />,
    testCase: (getComponent) => {
      test("opening from the input keeps focus in the input and still allows typing", async () => {
        await render(getComponent())

        await input().click()
        await expect.element(grid()).toBeVisible()
        await expect.element(input()).toHaveFocus()

        await userEvent.keyboard("06/20/2024")

        await expect.element(input()).toHaveValue("06/20/2024")
        await expect.element(input()).toHaveFocus()
      })
    },
  },
]

describe("DatePicker - Focus trap", () => {
  runTests(tests)

  test("containment survives the presets panel making the paging triggers inert", async () => {
    await render(
      <>
        <DatePicker
          closeOnSelect={false}
          defaultFocusedValue={seeded}
          label="Trip"
          presets={[
            {label: "Next 7 days", value: "next7Days"},
            {label: "This month", value: "thisMonth"},
          ]}
          selectionMode="range"
        />
        <button type="button">{trailingLabel}</button>
      </>,
    )

    await openCalendar()
    await page.getByRole("button", {name: /show presets/i}).click()
    await expect.element(page.getByText("Next 7 days")).toBeVisible()

    await page.getByRole("textbox", {name: /start date/i}).click()
    await userEvent.tab({shift: true})

    await expect.element(page.getByRole("button", {name: "OK"})).toHaveFocus()
    await expect.element(page.getByText("Next 7 days")).toBeVisible()
  })

  test("an inline calendar does not trap focus", async () => {
    await render(
      <>
        <DatePicker
          defaultFocusedValue={seeded}
          label="Departure date"
          variant="inline"
        />
        <button type="button">{trailingLabel}</button>
      </>,
    )

    await focusedCell().click()
    await expect.element(focusedCell()).toHaveFocus()

    await userEvent.tab()

    await expect.element(trailingButton()).toHaveFocus()
  })
})
