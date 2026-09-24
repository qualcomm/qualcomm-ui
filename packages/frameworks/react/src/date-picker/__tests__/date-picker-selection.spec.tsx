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

function Composite(props: Partial<DatePickerRootProps>) {
  return (
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
  )
}

function Simple(props: Partial<DatePickerProps>) {
  return (
    <DatePicker
      defaultFocusedValue={seeded}
      label="Departure date"
      {...props}
    />
  )
}

const tests: MultiComponentTestCase[] = [
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("selecting a day with the pointer commits it and closes", async () => {
        await render(getComponent())
        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

        await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/20/2024")
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("Space selects the focused day the calendar opened on", async () => {
        await render(getComponent())
        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await userEvent.keyboard("{ }")
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/15/2024")
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("Enter selects the focused day the calendar opened on", async () => {
        await render(getComponent())
        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await userEvent.keyboard("{Enter}")
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/15/2024")
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("arrow keys move day focus before committing", async () => {
        await render(getComponent())
        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await userEvent.keyboard("{ArrowRight}{Enter}")
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/16/2024")
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("ArrowDown moves focus forward one week", async () => {
        await render(getComponent())
        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await userEvent.keyboard("{ArrowDown}{Enter}")
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/22/2024")
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("Home jumps to the first day of the month", async () => {
        await render(getComponent())
        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await userEvent.keyboard("{Home}{Enter}")
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/01/2024")
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("End jumps to the last day of the month", async () => {
        await render(getComponent())
        await page
          .getByRole("button", {name: /(?:choose|change) date/i})
          .click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await userEvent.keyboard("{End}{Enter}")
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/30/2024")
      })
    },
  },
]

describe("DatePicker - Selection", () => {
  runTests(tests)
})
