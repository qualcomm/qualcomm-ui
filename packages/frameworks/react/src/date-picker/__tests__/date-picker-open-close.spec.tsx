import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {
  DatePicker,
  type DatePickerProps,
  type DatePickerRootProps,
} from "@qualcomm-ui/react/date-picker"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

function Composite(props: Partial<DatePickerRootProps>) {
  return (
    <DatePicker.Root {...props}>
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
  return <DatePicker label="Departure date" {...props} />
}

const tests: MultiComponentTestCase[] = [
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("opens on trigger click and closes on Escape, restoring focus to the trigger", async () => {
        await render(getComponent())

        await expect.element(page.getByRole("grid")).not.toBeInTheDocument()

        await page.getByRole("button", {name: /open calendar/i}).click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await userEvent.keyboard("{Escape}")
        await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
        await expect
          .element(page.getByRole("button", {name: /open calendar/i}))
          .toHaveFocus()
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("toggles closed when the trigger is clicked while open", async () => {
        await render(getComponent())

        const trigger = page.getByRole("button", {name: /calendar/i})
        await trigger.click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        await trigger.click()
        await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
      })
    },
  },
  {
    composite: () => <Composite defaultOpen />,
    simple: () => <Simple defaultOpen />,
    testCase: (getComponent) => {
      test("defaultOpen renders the calendar initially open", async () => {
        await render(getComponent())
        await expect.element(page.getByRole("grid")).toBeVisible()
      })
    },
  },
  {
    composite: () => <Composite defaultOpen open={false} />,
    simple: () => <Simple defaultOpen open={false} />,
    testCase: (getComponent) => {
      test("controlled open={false} wins over defaultOpen", async () => {
        await render(getComponent())
        await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
      })
    },
  },
]

describe("DatePicker - Open/Close", () => {
  runTests(tests)
})
