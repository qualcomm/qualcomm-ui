import {describe, expect, test, vi} from "vitest"
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

const openCalendar = () =>
  page.getByRole("button", {name: /open calendar/i}).click()

const dayCell = (day: RegExp) => page.getByRole("gridcell", {name: day})

/** Cell state and focus live on the trigger inside the `gridcell`. */
const dayTrigger = (day: string) => page.getByLabelText(day)

const weekends = (date: {day: number; month: number; year: number}) => {
  const weekday = new Date(date.year, date.month - 1, date.day).getDay()
  return weekday === 0 || weekday === 6
}

const tests: MultiComponentTestCase<Partial<DatePickerRootProps>>[] = [
  {
    composite: () => (
      <Composite max={parseDate("2024-06-20")} min={parseDate("2024-06-10")} />
    ),
    simple: () => (
      <Simple max={parseDate("2024-06-20")} min={parseDate("2024-06-10")} />
    ),
    testCase: (getComponent) => {
      test("days outside min and max are marked unselectable", async () => {
        await render(getComponent())
        await openCalendar()

        await expect
          .element(dayCell(/June 9, 2024/))
          .toHaveAttribute("aria-disabled", "true")
        await expect
          .element(dayCell(/June 21, 2024/))
          .toHaveAttribute("aria-disabled", "true")
        await expect
          .element(dayCell(/June 10, 2024/))
          .toHaveAttribute("aria-disabled", "false")
        await expect
          .element(dayCell(/June 20, 2024/))
          .toHaveAttribute("aria-disabled", "false")
      })
    },
  },
  {
    composite: (props) => (
      <Composite
        max={parseDate("2024-06-20")}
        min={parseDate("2024-06-10")}
        {...props}
      />
    ),
    simple: (props) => (
      <Simple
        max={parseDate("2024-06-20")}
        min={parseDate("2024-06-10")}
        {...props}
      />
    ),
    testCase: (getComponent) => {
      test("clicking a day outside min and max selects nothing", async () => {
        const onValueChange = vi.fn()
        await render(getComponent({onValueChange}))
        await openCalendar()

        const cell = dayTrigger("June 25, 2024").element() as HTMLElement
        cell.click()

        expect(onValueChange).not.toHaveBeenCalled()
        await expect.element(page.getByRole("grid")).toBeVisible()
      })
    },
  },
  {
    composite: (props) => <Composite isDateUnavailable={weekends} {...props} />,
    simple: (props) => <Simple isDateUnavailable={weekends} {...props} />,
    testCase: (getComponent) => {
      test("unavailable days announce themselves and reject clicks", async () => {
        const onValueChange = vi.fn()
        await render(getComponent({onValueChange}))
        await openCalendar()

        // June 16 2024 is a Sunday
        await expect
          .element(dayTrigger("June 16, 2024"))
          .toHaveAttribute(
            "aria-label",
            expect.stringContaining("Not available"),
          )
        await expect
          .element(dayTrigger("June 16, 2024"))
          .toHaveAttribute("data-unavailable")

        const sunday = dayTrigger("June 16, 2024").element() as HTMLElement
        sunday.click()
        expect(onValueChange).not.toHaveBeenCalled()

        await dayCell(/June 17, 2024/).click()
        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/17/2024")
      })
    },
  },
  {
    composite: () => <Composite isDateUnavailable={weekends} />,
    simple: () => <Simple isDateUnavailable={weekends} />,
    testCase: (getComponent) => {
      test("Space on an unavailable day does not commit it", async () => {
        await render(getComponent())
        await openCalendar()

        // June 15 2024 is a Saturday, and is the day the calendar opens on
        await userEvent.keyboard("{ }")

        await expect.element(page.getByRole("textbox")).toHaveValue("")
        await expect.element(page.getByRole("grid")).toBeVisible()
      })
    },
  },
  {
    composite: () => <Composite isDateUnavailable={weekends} />,
    simple: () => <Simple isDateUnavailable={weekends} />,
    testCase: (getComponent) => {
      test("Enter on an unavailable day does not commit it", async () => {
        await render(getComponent())
        await openCalendar()

        // June 15 2024 is a Saturday, and is the day the calendar opens on
        await userEvent.keyboard("{Enter}")

        await expect.element(page.getByRole("textbox")).toHaveValue("")
        await expect.element(page.getByRole("grid")).toBeVisible()
      })
    },
  },
  {
    composite: () => <Composite isDateUnavailable={weekends} />,
    simple: () => <Simple isDateUnavailable={weekends} />,
    testCase: (getComponent) => {
      test("typing an unavailable date reverts the input to the last committed value", async () => {
        await render(getComponent())

        const input = page.getByRole("textbox")
        await input.fill("06/17/2024")
        await userEvent.keyboard("{Enter}")
        await expect.element(input).toHaveValue("06/17/2024")

        await input.fill("06/16/2024")
        await userEvent.keyboard("{Enter}")

        await expect.element(input).toHaveValue("06/17/2024")
      })
    },
  },
  {
    composite: () => <Composite />,
    simple: () => <Simple />,
    testCase: (getComponent) => {
      test("days spilling in from the neighbouring months are not selectable by default", async () => {
        await render(getComponent())
        await openCalendar()

        // June 2024 starts on a Saturday, so late May fills the first row
        await expect
          .element(dayTrigger("May 26, 2024"))
          .toHaveAttribute("data-outside-range")
        await expect
          .element(dayCell(/May 26, 2024/))
          .toHaveAttribute("aria-disabled", "true")
      })
    },
  },
  {
    composite: () => <Composite outsideDaySelectable />,
    simple: () => <Simple outsideDaySelectable />,
    testCase: (getComponent) => {
      test("outsideDaySelectable lets a spilled-in day be picked", async () => {
        await render(getComponent())
        await openCalendar()

        await dayCell(/May 26, 2024/).click()

        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("05/26/2024")
      })
    },
  },
  {
    composite: () => (
      <Composite
        defaultValue={[parseDate("2024-06-25")]}
        max={parseDate("2024-06-20")}
      />
    ),
    simple: () => (
      <Simple
        defaultValue={[parseDate("2024-06-25")]}
        max={parseDate("2024-06-20")}
      />
    ),
    testCase: (getComponent) => {
      test("a defaultValue beyond max is pulled back to max", async () => {
        await render(getComponent())

        await expect
          .element(page.getByRole("textbox"))
          .toHaveValue("06/20/2024")
      })
    },
  },
]

describe("DatePicker - Constraints", () => {
  runTests(tests)

  test("today's cell is flagged for assistive tech", async () => {
    await render(<DatePicker label="Departure date" variant="inline" />)
    await expect.element(page.getByRole("grid")).toBeVisible()

    const grid = page.getByRole("grid").element()
    const today = grid.querySelectorAll('[aria-current="date"]')

    expect(today).toHaveLength(1)
    expect(today[0].querySelector("[data-today]")).not.toBeNull()
  })

  test("an unavailable day that is also selected still reads as unavailable", async () => {
    await render(
      <DatePicker
        closeOnSelect={false}
        defaultFocusedValue={seeded}
        defaultValue={[seeded]}
        isDateUnavailable={weekends}
        label="Departure date"
      />,
    )
    await openCalendar()

    await expect
      .element(dayTrigger("June 15, 2024"))
      .toHaveAttribute("aria-label", expect.stringContaining("Not available"))
    await expect
      .element(dayTrigger("June 15, 2024"))
      .toHaveAttribute("data-selected")
  })

  test("fixedWeeks always renders six week rows", async () => {
    // February 2021 fits in exactly four rows without padding
    await render(
      <DatePicker
        defaultFocusedValue={parseDate("2021-02-01")}
        fixedWeeks
        label="Departure date"
        variant="inline"
      />,
    )

    await expect.element(page.getByRole("grid")).toBeVisible()
    expect(
      page.getByRole("grid").element().querySelectorAll("tbody tr"),
    ).toHaveLength(6)
  })

  test("startOfWeek shifts the weekday header order", async () => {
    const weekdayNames = () =>
      Array.from(
        page.getByRole("grid").element().querySelectorAll("thead th"),
      ).map((cell) => cell.getAttribute("aria-label"))

    const {unmount} = await render(
      <DatePicker
        defaultFocusedValue={seeded}
        label="Departure date"
        variant="inline"
      />,
    )
    await expect.element(page.getByRole("grid")).toBeVisible()
    expect(weekdayNames()).toEqual([
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ])
    await unmount()

    await render(
      <DatePicker
        defaultFocusedValue={seeded}
        label="Departure date"
        startOfWeek={1}
        variant="inline"
      />,
    )
    await expect.element(page.getByRole("grid")).toBeVisible()
    expect(weekdayNames()).toEqual([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ])
  })
})
