import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {Button} from "@qualcomm-ui/react/button"
import {
  DatePicker,
  type DatePickerProps,
  type DatePickerRootProps,
  parseDate,
} from "@qualcomm-ui/react/date-picker"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const seeded = parseDate("2024-06-15")

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

function DayView() {
  return (
    <DatePicker.View view="day">
      <DatePicker.ViewControl>
        <DatePicker.PrevTrigger />
        <DatePicker.NextTrigger />
      </DatePicker.ViewControl>
      <DatePicker.Table>
        <DatePicker.DayGridHeader />
        <DatePicker.DayGrid />
      </DatePicker.Table>
    </DatePicker.View>
  )
}

function Composite(props: Partial<DatePickerRootProps>) {
  return (
    <DatePicker.Root defaultFocusedValue={seeded} {...props}>
      <DatePicker.Control>
        <DatePicker.InputGroup label="Departure date" />
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DayView />
            <DatePicker.View view="month">
              <DatePicker.ViewControl>
                <DatePicker.PrevTrigger />
                <DatePicker.NextTrigger />
              </DatePicker.ViewControl>
              <DatePicker.Table>
                <DatePicker.MonthGrid />
              </DatePicker.Table>
            </DatePicker.View>
            <DatePicker.View view="year">
              <DatePicker.ViewControl>
                <DatePicker.PrevTrigger />
                <DatePicker.NextTrigger />
              </DatePicker.ViewControl>
              <DatePicker.Table>
                <DatePicker.YearGrid />
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
      test("trigger accessible name reflects the open state", async () => {
        await render(getComponent())

        const trigger = page.getByRole("button", {name: /open calendar/i})
        await trigger.click()

        await expect
          .element(page.getByRole("button", {name: /close calendar/i}))
          .toBeVisible()
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("weekday headers expose full day names to assistive technology", async () => {
        await render(getComponent())

        await page.getByRole("button", {name: /open calendar/i}).click()
        await expect.element(page.getByRole("grid")).toBeVisible()

        const headers = page.getByRole("columnheader")
        expect(headers.elements()).toHaveLength(7)

        for (const [index, weekday] of weekdays.entries()) {
          await expect.element(headers.nth(index)).toHaveAccessibleName(weekday)
        }
      })
    },
  },
  {
    simple: () => <Simple variant="inline" />,
    testCase: (getComponent) => {
      test("inline variant renders an always-open calendar with no popover trigger", async () => {
        await render(getComponent())

        await expect.element(page.getByRole("grid")).toBeVisible()
        await expect
          .element(page.getByRole("button", {name: /open calendar/i}))
          .not.toBeInTheDocument()
      })
    },
  },
  {
    composite: () => (
      <DatePicker.Root closeOnSelect={false} defaultFocusedValue={seeded}>
        <DatePicker.Context>
          {(api) => (
            <DatePicker.Control>
              <DatePicker.Trigger render={<Button variant="outline" />}>
                {api.valueAsString[0] ?? "Pick a date"}
              </DatePicker.Trigger>
            </DatePicker.Control>
          )}
        </DatePicker.Context>
        <Portal>
          <DatePicker.Positioner>
            <DatePicker.Content>
              <DayView />
            </DatePicker.Content>
          </DatePicker.Positioner>
        </Portal>
      </DatePicker.Root>
    ),
    testCase: (getComponent) => {
      test("a custom Trigger renders custom content and opens the calendar", async () => {
        await render(getComponent())

        await expect.element(page.getByText("Pick a date")).toBeVisible()

        await page.getByRole("button", {name: /open calendar/i}).click()
        await expect.element(page.getByRole("grid")).toBeVisible()
      })
    },
  },
  {
    composite: () => <Composite minView="month" />,
    testCase: (getComponent) => {
      test("minView='month' opens directly at the month view", async () => {
        await render(getComponent())
        await page.getByRole("button", {name: /open calendar/i}).click()

        await expect
          .element(page.getByRole("grid"))
          .toHaveAttribute("aria-roledescription", "calendar year")
      })
    },
  },
]

describe("DatePicker - Parts", () => {
  runTests(tests)

  test("the calendar grid is named by the range it shows, at every view level", async () => {
    await render(<Simple variant="inline" />)

    const grid = () => page.getByRole("grid")
    await expect.element(grid()).toHaveAccessibleName("June 2024")

    await page.getByRole("button", {name: /switch to next month/i}).click()
    await expect.element(grid()).toHaveAccessibleName("July 2024")

    await page.getByRole("button", {name: /switch to month view/i}).click()
    await expect.element(grid()).toHaveAccessibleName("2024")

    await page.getByRole("button", {name: /return to calendar/i}).click()
    await page.getByRole("button", {name: /switch to year view/i}).click()
    await expect.element(grid()).toHaveAccessibleName("2020 - 2029")
  })

  test("a range picker's grid name does not repeat a single visible month", async () => {
    await render(<Simple selectionMode="range" variant="inline" />)

    await expect
      .element(page.getByRole("grid"))
      .toHaveAccessibleName("June 2024")
  })

  test("the inline headline captions the current selection", async () => {
    await render(<Simple variant="inline" />)

    await expect.element(page.getByText("Date", {exact: true})).toBeVisible()
    await expect.element(page.getByText("Select date")).toBeVisible()

    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(page.getByText("Thu, June 20, 2024")).toBeVisible()
  })

  test("a range picker's headline caption names the range", async () => {
    await render(<Simple selectionMode="range" variant="inline" />)

    await expect.element(page.getByText("Date range")).toBeVisible()
  })

  test("headline={false} drops the headline from the inline calendar", async () => {
    await render(<Simple headline={false} variant="inline" />)

    await expect.element(page.getByRole("grid")).toBeVisible()
    await expect.element(page.getByText("Select date")).not.toBeInTheDocument()
  })

  test("the inline variant has no field, so there is no input or clear trigger", async () => {
    await render(<Simple defaultValue={[seeded]} variant="inline" />)

    await expect.element(page.getByRole("textbox")).not.toBeInTheDocument()
    await expect
      .element(page.getByRole("button", {name: /clear selected dates/i}))
      .not.toBeInTheDocument()
  })

  test("the context render prop re-renders once a selection commits", async () => {
    await render(
      <DatePicker.Root defaultFocusedValue={seeded}>
        <DatePicker.Context>
          {(api) => <span>{api.valueAsString[0] ?? "nothing selected"}</span>}
        </DatePicker.Context>
        <DatePicker.Control>
          <DatePicker.InputGroup label="Departure date" />
        </DatePicker.Control>
        <Portal>
          <DatePicker.Positioner>
            <DatePicker.Content>
              <DayView />
            </DatePicker.Content>
          </DatePicker.Positioner>
        </Portal>
      </DatePicker.Root>,
    )
    await expect.element(page.getByText("nothing selected")).toBeVisible()

    await page.getByRole("button", {name: /open calendar/i}).click()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(page.getByText("06/20/2024")).toBeVisible()
    await expect
      .element(page.getByText("nothing selected"))
      .not.toBeInTheDocument()
  })

  test("a trigger-only picker returns focus to the trigger after a selection", async () => {
    await render(
      <DatePicker.Root closeOnSelect defaultFocusedValue={seeded}>
        <DatePicker.Control>
          <DatePicker.Trigger render={<Button variant="outline" />}>
            Pick a date
          </DatePicker.Trigger>
        </DatePicker.Control>
        <Portal>
          <DatePicker.Positioner>
            <DatePicker.Content>
              <DayView />
            </DatePicker.Content>
          </DatePicker.Positioner>
        </Portal>
      </DatePicker.Root>,
    )

    await page.getByRole("button", {name: /open calendar/i}).click()
    await page.getByRole("gridcell", {name: /June 20, 2024/}).click()

    await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
    await expect
      .element(page.getByRole("button", {name: /open calendar/i}))
      .toHaveFocus()
  })
})
